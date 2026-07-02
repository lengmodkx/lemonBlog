---
title: "RuoYi-Cloud-Plus 多开发者环境下 Dubbo Tag 路由踩坑记录"
date: "2026-07-02"
category: "技术学习"
tags:
  - Nacos
  - 多环境
  - 开发调试
  - format/article
---

# RuoYi-Cloud-Plus 多开发者环境下 Dubbo Tag 路由踩坑记录

> 环境：Spring Boot 3.5.14 / Spring Cloud 2025.0.2 / Dubbo 3.3.6 / Nacos 2.5.1 / Java 21

## 一、问题现象

本地启动 `ruoyi-auth` 和 `ruoyi-system` 后，登录接口报错：

```text
RPC异常: Failed to invoke the method queryByTenantId in the service org.dromara.system.api.RemoteTenantService.
No provider available for the service org.dromara.system.api.RemoteTenantService from registry
ServiceDiscoveryRegistryDirectory(registry: 39.153.154.183:8848, subscribed key: [ruoyi-system])
- Directory(invokers: 1[100.128.1.6:20880], validInvokers: 1[100.128.1.6:20880], invokersToReconnect: 0[])
```

**诡异点**：
- Nacos 里明明能看到 `ruoyi-system` 提供者；
- 同一个 HTTP 请求里，**第一次** Dubbo 调用 `RemoteClientService.queryByClientId` 能成功，**第二次** `RemoteTenantService.queryByTenantId` 却失败。

## 二、背景：为什么要做 Tag 路由

团队共用一套 Nacos 注册中心，本地开发时经常出现：
- A 开发者本地启动了 `ruoyi-system`；
- B 开发者本地启动 `ruoyi-auth`，请求却打到了 A 的 `ruoyi-system`；
- 互相干扰，排查困难。

所以设计了 **开发调试 Tag 路由**：
- HTTP 请求头：`X-RuoYi-Dev-Tag`
- Nacos 元数据：`tag`
- Dubbo Provider Tag：`dubbo.provider.tag`
- 目标：同 Tag 的服务互相调用，隔离不同开发者。

## 三、排查过程

### 3.1 初步怀疑：Tag 不一致

Nacos 里看到共享/本地服务的 `tag` 都是 `100.128.1.6`，但消费者 `192.168.31.229` 无法路由到提供者 `100.128.1.6:20880`。

查看 Dubbo 3.3.6 `TagStateRouter` 源码：

```java
String tag = StringUtils.isEmpty(invocation.getAttachment(TAG_KEY)) ? url.getParameter(TAG_KEY) :
    invocation.getAttachment(TAG_KEY);
```

Dubbo Tag 路由从 **Invocation 附件** 读取 consumer tag，再匹配 provider URL 上的 `tag` 参数。

### 3.2 第一次修复：恢复 IP fallback

最初把 `RLOYI_DEV_TAG` 的 fallback 从本机 IP 改成了必须显式设置，但用户希望“默认用本机 IP”。于是恢复为：

```text
RLOYI_DEV_TAG > 本机第一个非 127/0 开头的 IPv4
```

但问题依旧。

### 3.3 关键线索：第一次 RPC 成功，第二次失败

从日志发现：

```text
10:29:56 Dubbo - 服务调用: RemoteClientService.queryByClientId   ✅ 成功
10:29:56 Dubbo - 服务调用: RemoteTenantService.queryByTenantId   ❌ 失败
```

这说明 **Tag 在第一次 RPC 后被清掉了**。

翻 Dubbo 3.3.6 源码，定位到 `ConsumerContextFilter`：

```java
public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
    ...
    // 调用前把 RpcContext.getClientAttachment() 拷贝到 Invocation
    ((RpcInvocation) invocation).addObjectAttachments(contextAttachments);
    ...
}

public void onResponse(...) {
    removeContext(invocation);
}

private void removeContext(Invocation invocation) {
    RpcContext.removeClientAttachment(); // ← 每次 RPC 后清空 ClientAttachment
    ...
}
```

`DevTagServletFilter` 只在 HTTP 请求开始时往 `RpcContext.getClientAttachment()` 写了一次 Tag。第一次 RPC 时 Tag 还在，第二次 RPC 时已被 `ConsumerContextFilter` 清空，`TagRouter` 认为 consumer 没带 Tag，于是过滤掉了带 Tag 的 provider。

### 3.4 还发现两个问题

1. **`@ConditionalOnProperty` 生效时机问题**

   `DevTagServletFilter` 加了：

   ```java
   @ConditionalOnProperty(prefix = "ruoyi.dev", name = "enabled", havingValue = "true")
   ```

   这个条件在 Spring 自动配置阶段就判断，**可能早于 Nacos 共享配置加载**，导致 Filter 根本没注册。

2. **多网卡下 IP 选择不一致**

   ```java
   NetUtil.localIpv4s().stream().filter(...).findFirst()
   ```

   `findFirst()` 不排序，本机有 VPN（`100.128.1.6`）和本地网卡（`192.168.31.229`）时，不同 JVM 启动可能选到不同 IP，导致 provider/consumer Tag 不一致。

3. **Spring Boot 3 注册 EnvironmentPostProcessor**

   Spring Boot 3 需要用 `META-INF/spring/org.springframework.boot.env.EnvironmentPostProcessor.imports`，仅写 `spring.factories` 可能不生效。

## 四、最终解决方案

### 4.1 核心：Dubbo ClusterFilter 每次 RPC 前强制写 Tag

`ClusterFilter` 在 `TagRouter` 之前执行，且每次 RPC 都会执行，不受 `RpcContext` 清理影响。

```java
@Activate(group = CommonConstants.CONSUMER, order = Integer.MIN_VALUE + 100)
public class DevTagClusterFilter implements ClusterFilter {

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        String tag = resolveTag();
        if (StrUtil.isNotBlank(tag)) {
            invocation.setAttachment(CommonConstants.TAG_KEY, tag);
        }
        return invoker.invoke(invocation);
    }

    private String resolveTag() {
        // 1. 优先用 HTTP 请求头里透传的 Tag
        String contextTag = DevTagContext.get();
        if (StrUtil.isNotBlank(contextTag)) {
            return contextTag;
        }
        // 2. 否则用本地配置或本机 IP fallback
        return DevTagHolder.getEffectiveTag();
    }
}
```

注册：

```text
# META-INF/dubbo/org.apache.dubbo.rpc.cluster.filter.ClusterFilter
devTagCluster=org.dromara.common.loadbalance.filter.DevTagClusterFilter
```

### 4.2 用 ThreadLocal 跨多次 RPC 保留请求级 Tag

```java
public class DevTagContext {
    private static final ThreadLocal<String> TAG = new ThreadLocal<>();
    // set / get / clear
}
```

`DevTagServletFilter` 在请求开始时写入，在 `finally` 中清理：

```java
if (StrUtil.isNotBlank(tag)) {
    RpcContext.getClientAttachment().setAttachment(CommonConstants.TAG_KEY, tag);
    DevTagContext.set(tag);
}
try {
    filterChain.doFilter(request, response);
} finally {
    RpcContext.getClientAttachment().removeAttachment(CommonConstants.TAG_KEY);
    DevTagContext.clear();
}
```

### 4.3 去掉 `@ConditionalOnProperty`

让 Filter 在 Servlet 环境下无条件注册，运行时再用 `DevTagProperties.enabled` 判断是否生效：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public static class DevTagServletFilterConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public DevTagServletFilter devTagServletFilter(DevTagProperties devTagProperties) {
        return new DevTagServletFilter(devTagProperties);
    }
}
```

### 4.4 稳定的本机 IP 选择

新增 `DevTagResolver`，对本地 IPv4 排序后取第一个，避免多网卡时选到不同 IP：

```java
public static String resolveLocalIp() {
    return NetUtil.localIpv4s().stream()
        .filter(s -> s != null && !s.isBlank())
        .filter(s -> !s.startsWith("127.") && !s.startsWith("0.") && !s.equals("localhost"))
        .sorted()
        .findFirst()
        .orElse(null);
}
```

### 4.5 Spring Boot 3 注册 EnvironmentPostProcessor

```text
# META-INF/spring/org.springframework.boot.env.EnvironmentPostProcessor.imports
org.dromara.common.loadbalance.config.EnvEnvironmentPostProcessor
```

## 五、验证

重新编译并重启 `ruoyi-system`、`ruoyi-auth` 后：

```powershell
mvn clean install -pl ruoyi-auth,ruoyi-modules/ruoyi-system -am '-Dmaven.test.skip=true'
```

登录接口恢复正常，Nacos 中 `ruoyi-auth` 和 `ruoyi-system` 的 `tag` 一致，多次 RPC 调用都能正确路由到同 Tag 的本地服务。

## 六、经验总结

1. **Dubbo 3 的 `RpcContext.getClientAttachment()` 不是线程内常驻的**，每次 RPC 后会被 `ConsumerContextFilter` 清理，不能用来在单次 HTTP 请求内给多次 RPC 传 Tag。
2. **`ClusterFilter` 是更可靠的位置**：它在 `TagRouter` 之前执行，且每次 RPC 都会执行。
3. **`@ConditionalOnProperty` 对 Nacos 共享配置要谨慎**：自动配置阶段可能还没加载到 Nacos 配置。
4. **多网卡环境下 `findFirst()` 不可靠**：必须排序或使用固定规则选择 IP。
5. **Spring Boot 3 记得用 `.imports` 文件**：`spring.factories` 对部分扩展点已废弃。
