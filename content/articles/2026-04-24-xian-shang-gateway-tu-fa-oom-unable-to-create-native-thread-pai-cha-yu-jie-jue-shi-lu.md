---
title: "线上 Gateway 突发 OOM：unable to create native thread 排查与解决实录"
date: "2026-04-24"
category: 技术学习
tags:
  - Java
  - Spring Cloud
  - Gateway
  - 微服务
  - JVM
  - OOM
  - format/article
---

> **环境**：JeecgBoot 微服务架构、Spring Cloud Gateway、Nacos、Woodpecker CI/CD  
> **现象**：Gateway 服务运行一段时间后，频繁抛出 `java.lang.OutOfMemoryError: unable to create native thread`，最终导致服务不可用  
> **核心原因**：线程数（而非堆内存）耗尽

---

## 一、问题现象

凌晨 02:01，线上 Gateway 服务开始疯狂报错：

```
2026-04-24 02:01:38.226 [Nacos-Watch-Task-Scheduler-1] ERROR 
java.lang.OutOfMemoryError: unable to create native thread: 
  possibly out of memory or process/resource limits reached
  at java.base/java.lang.Thread.start0(Native Method)
```

同时伴随：
- `No servers available for service: jeecg-admin`（负载均衡找不到实例）
- `Failed to start thread "boundedElastic-13363"`（线程编号已飙到一万多）
- `pthread_create failed (EAGAIN)`（操作系统拒绝创建线程）

---

## 二、日志定位：这不是堆内存溢出

很多人看到 `OutOfMemoryError` 第一反应是调大 `-Xmx`，但这次的堆栈揭露了真相：

```
[829668.271s][warning][os,thread] 
Failed to start thread - pthread_create failed (EAGAIN) 
for attributes: stacksize: 1024k
```

**关键点**：
1. 错误发生在 `Thread.start0`（JNI 创建系统线程）
2. 每个线程默认栈大小 **1MB**（`stacksize: 1024k`）
3. Gateway 的 `boundedElastic-xxx` 线程编号已超过 13000+

这说明：**Java 堆内存可能还很充足，但操作系统线程数/内存已耗尽**。

---

## 三、根因分析：Gateway + Nacos 的"线程风暴"

从堆栈可以看出，线程创建的触发链路是：

```
NacosWatch.nacosServicesWatch (定时刷新服务列表)
  → RouteRefreshListener.reset (触发路由刷新)
    → RouteDefinitionMetrics.onApplicationEvent (路由指标事件)
      → CachingRouteLocator.onApplicationEvent (缓存路由定位器)
        → Reactor Flux.subscribe (大量异步订阅)
          → Schedulers.boundedElastic (弹性线程池创建新线程)
```

**问题本质**：
- Spring Cloud Gateway 默认开启 `RouteDefinitionMetrics`，每次路由刷新都会触发大量 Reactor 异步流
- `Schedulers.boundedElastic()` 线程池在任务积压时会不断创建新线程
- Nacos 默认心跳间隔 5s，服务列表变动频繁，路由刷新过于密集
- Gateway HTTP 客户端连接池默认 `elastic` 类型，也会动态扩线程
- 缺少负载均衡缓存，每次请求都实时查询 Nacos 实例

---

## 四、解决方案：三管齐下

### 4.1 Nacos 配置层（应用配置）

在 Nacos 的 `jeecg-gateway-prod.yaml` 中增加以下配置：

```yaml
spring:
  cloud:
    gateway:
      # 关闭路由指标监控，这是线程风暴的元凶之一
      metrics:
        enabled: false
      httpclient:
        # 固定连接池，禁止 elastic 动态扩容
        pool:
          type: fixed
          max-connections: 200
          max-idle-time: 10s
          max-life-time: 30s
          eviction-interval: 10s

    # 负载均衡缓存，减少对 Nacos 的实时查询
    loadbalancer:
      cache:
        enabled: true
        ttl: 10s
        capacity: 512
      health-check:
        interval: 15

    # Nacos 心跳调大，降低 Watch 触发频率
    nacos:
      discovery:
        server-addr: <真实Nacos地址>:8848  # ⚠️ 不要写 127.0.0.1
        heart-beat-interval: 10000
        heart-beat-timeout: 30000
        ip-delete-timeout: 60000
        naming-push-empty-protection: true
        naming-load-cache-at-start: true
```

### 4.2 JVM 与容器层（部署配置）

**Dockerfile**：

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/*.jar app.jar

# 默认 JVM 参数，支持通过环境变量覆盖
ENV JAVA_OPTS="-Xss512k -XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Dreactor.netty.ioWorkerCount=8"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

**关键参数说明**：
- `-Xss512k`：**核心参数**，将线程栈从 1MB 降到 512KB，同样内存下可支撑线程数翻倍
- `-Dreactor.netty.ioWorkerCount=8`：限制 Reactor Netty IO 线程数
- `-XX:+UseG1GC`：适合服务端低延迟场景

**Woodpecker / Docker 启动时**：

```bash
docker run -d \
  --name jeecg-gateway \
  --ulimit nproc=65535:65535 \
  --ulimit nofile=65535:65535 \
  -e JAVA_OPTS='-Xss512k -XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Dreactor.netty.ioWorkerCount=8' \
  -p 9999:9999 \
  gateway-image
```

> `--ulimit` 必须在容器**首次创建**时指定，后续 `docker update` 无法修改。

**系统层面**（宿主机）：

```bash
# /etc/security/limits.conf
* soft nproc 65535
* hard nproc 65535
* soft nofile 65535
* hard nofile 65535
```

### 4.3 CI/CD 层（Woodpecker）

由于使用 Woodpecker + Gitea 自动化部署，所有变更都应该落到代码仓库：

- `.woodpecker/gateway.yml`：deploy step 中显式指定 `--ulimit` 和 `-e JAVA_OPTS`
- `Dockerfile`：支持 `JAVA_OPTS` 环境变量注入
- Nacos 配置：线上修改后做好版本记录

---

## 五、踩坑实录

### 坑 1：reactor.netty 配置写在 YAML 里不生效

最初在 `application.yml` 中写了：

```yaml
reactor:
  netty:
    io-worker-count: 8
```

**实际上 Spring Boot 不会自动识别这些属性**，Reactor Netty 的线程数必须通过 **JVM 系统参数** `-Dreactor.netty.ioWorkerCount=8` 传入。

### 坑 2：YAML 中 spring 节点重复导致配置被覆盖

如果 `spring.redis` 和 `spring.cloud` 写在不同的 `spring:` 根节点下，某些解析器可能会合并失败。建议统一放在一个 `spring:` 节点内。

---

## 六、验证与监控

修复后，通过以下命令验证线程数是否稳定：

```bash
# 查看 Java 进程线程数
watch -n 5 'cat /proc/$(pgrep -f "jeecg-gateway")/status | grep Threads'

# 查看 boundedElastic 线程是否还在疯涨
jstack <pid> | grep -c "boundedElastic"
```

正常稳定后，Gateway 线程数应在 **200~500** 之间，不再持续增长。

---

## 八、经验总结

1. **OOM 不一定是堆内存问题**：`unable to create native thread` 是线程/系统资源耗尽，调大 `-Xmx` 无效。
2. **线程栈大小是关键**：`-Xss512k` 在微服务网关场景下是性价比极高的优化。
3. **Spring Cloud Gateway 生产必调**：
   - 关闭 `metrics.enabled`
   - HTTP 客户端连接池用 `fixed` 而非 `elastic`
   - 开启负载均衡缓存
4. **Nacos 心跳不要调太小**：默认 5s 对网关来说太频繁，建议 10s 以上。
5. **CI/CD 即配置**：所有环境参数（JVM、ulimit、Docker 参数）都应该落到代码仓库，避免手动改服务器的黑盒操作。

---

*2026-04-24 排查记录*
