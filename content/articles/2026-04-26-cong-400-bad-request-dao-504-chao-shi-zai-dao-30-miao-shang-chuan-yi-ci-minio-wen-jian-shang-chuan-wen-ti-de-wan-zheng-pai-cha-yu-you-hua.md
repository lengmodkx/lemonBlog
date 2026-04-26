---
title: "从 400 Bad Request 到 504 超时再到 30 秒上传：一次 MinIO 文件上传问题的完整排查与优化"
date: 2026-04-26
category: 技术学习
tags:
  - MinIO
  - Nginx
  - 性能优化
  - format/article
---

# 从 400 Bad Request 到 504 超时再到 30 秒上传：一次 MinIO 文件上传问题的完整排查与优化

> 本文记录了一次生产环境 MinIO 文件上传问题的完整排查过程。从最初的上传失败，到后续的 Nginx 504 超时，再到上传速度慢的深层优化，涵盖了协议解析、流式上传、架构改造等多个技术点。

---

## 一、问题发现

### 1.1 初始现象

用户在报名系统中上传图片材料时，系统提示上传失败。查看后端日志，发现如下错误：

```
400 The plain HTTP request was sent to HTTPS port
```

完整堆栈：

```java
io.minio.errors.InvalidResponseException: Non-XML response from server. 
Response code: 400, Content-Type: text/html, body: 
<html>
<head><title>400 The plain HTTP request was sent to HTTPS port</title></head>
<body>
<center><h1>400 Bad Request</h1></center>
<center>The plain HTTP request was sent to HTTPS port</center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
```

### 1.2 环境信息

- **后端框架**：JeecgBoot 3.7
- **存储方案**：MinIO
- **MinIO 地址**：`https://storage.lengmodkx.club:9443`（Nginx 反向代理到 MinIO Console）
- **MinIO Java 客户端版本**：8.0.3
- **部署架构**：Nginx(8443) → 后端 Java(7001) → MinIO(9443)

---

## 二、问题一：400 Bad Request —— HTTP 请求发到了 HTTPS 端口

### 2.1 原因分析

MinIO 配置中的 URL 明明是 `https://` 开头：

```yaml
jeecg:
  minio:
    minio_url: https://storage.lengmodkx.club:9443
```

但 MinIO Java 客户端 8.0.3 的 `endpoint(String url)` 方法在处理**带非标准端口的 HTTPS URL** 时存在 bug，实际发送的却是 HTTP 请求，导致 Nginx 返回 400。

**问题代码**：

```java
minioClient = MinioClient.builder()
        .endpoint(minioUrl)  // 这里 minioUrl = "https://storage.lengmodkx.club:9443"
        .credentials(minioName, minioPass)
        .build();
```

### 2.2 解决方案

解析 URL 后，使用 `endpoint(String host, int port, boolean secure)` 重载方法，**显式指定**使用 HTTPS：

```java
java.net.URL url = new java.net.URL(minioUrl);
boolean secure = "https".equalsIgnoreCase(url.getProtocol());
int port = url.getPort();
if (port == -1) {
    port = secure ? 443 : 80;
}
minioClient = MinioClient.builder()
        .endpoint(url.getHost(), port, secure)
        .credentials(minioName, minioPass)
        .build();
```

---

## 三、问题二：504 Gateway Timeout —— 上传超时

### 3.1 现象

修复 400 错误后，上传不再报错，但浏览器收到 **504 Gateway Timeout**：

```
POST https://baoming.cfsedu.cn:8443/apiA/sys/common/upload 504 (Gateway Timeout)
```

从后端日志看时间线：

```
05:04:19.948  开始初始化 MinIO
05:04:19.948  MinIO 初始化成功
05:04:20.245  bucketExists 完成（约 300ms）
05:04:20.246  开始 putObject
05:04:49.908  504 超时（约 29.5 秒后）
```

### 3.2 原因分析

**直接原因**：`putObject` 上传耗时超过了 Nginx 的 30 秒超时阈值。

**深层原因**：`.stream(stream, stream.available(), -1)` 这一行代码有问题。

```java
PutObjectArgs objectArgs = PutObjectArgs.builder()
        .object(objectName)
        .bucket(newBucket)
        .contentType("application/octet-stream")
        .stream(stream, stream.available(), -1)  // ⚠️ 问题在这里
        .build();
```

`MultipartFile.getInputStream()` 的 `available()` 方法对网络流**不可靠**，经常返回 0 或不准确的值。MinIO 客户端收到错误的 size 后，会退化为低效的分块上传模式，导致传输极慢。

### 3.3 解决方案

改用 `file.getSize()` 获取准确的文件大小：

```java
long fileSize = file.getSize();
PutObjectArgs objectArgs = PutObjectArgs.builder()
        .object(objectName)
        .bucket(newBucket)
        .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
        .stream(stream, fileSize, -1)
        .build();
```

---

## 四、问题三：上传速度依然很慢（30秒传一张图）

### 4.1 瓶颈定位

修复 `stream.available()` 后，上传虽然不再 504，但一张几百 KB 的图片仍然需要 **接近 30 秒**。

从时间线分析：

```
05:04:19.948 → 05:04:20.245  bucketExists（300ms）
05:04:20.246 → 05:04:49.908  putObject（29.5s）
```

**根因**：文件传输路径是 `浏览器 → Nginx(8443) → 后端Java(7001) → MinIO(9443)`，最慢的是**后端 Java 到 MinIO**这一段。后端服务器与 MinIO 服务器之间的网络带宽/延迟是瓶颈。

<p align="center">
  <img src="img/upload-bottleneck-flow.svg" alt="原上传流程瓶颈分析" width="100%" style="max-width: 800px;"/>
</p>

### 4.2 代码层优化（治标）

在等待架构改造的同时，先做了代码层面的优化：

| 优化项 | 效果 |
|--------|------|
| **缓存 bucketExists** | 使用 `ConcurrentHashMap.newKeySet()` 缓存已确认的存储桶，避免每次上传都发一次 API 请求，节省约 300ms |
| **精简日志** | 将每次上传 6 条 info 日志减少到 2 条，降低 IO 开销 |
| **URL 拼接修复** | 自动处理 minio_url 末尾的 `/`，避免访问 404 |

```java
private static final Set<String> BUCKET_EXIST_CACHE = ConcurrentHashMap.newKeySet();

if (!BUCKET_EXIST_CACHE.contains(newBucket)) {
    boolean bucketExists = minioClient.bucketExists(...);
    if (!bucketExists) {
        minioClient.makeBucket(...);
    }
    BUCKET_EXIST_CACHE.add(newBucket);
}
```

### 4.3 架构层优化（治本）—— 前端直传 MinIO

**核心思路**：文件不再经过后端服务器，前端浏览器直接上传到 MinIO，后端只负责生成**临时预签名 URL** 和**确认入库**。

**新流程**：

<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" width="100%" style="max-width: 800px;">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4A5568"/>
    </marker>
    <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#38A169"/>
    </marker>
    <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3182CE"/>
    </marker>
  </defs>
  <rect width="800" height="420" fill="#F7FAFC" rx="12"/>
  <text x="400" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#2D3748" text-anchor="middle">前端直传 MinIO 架构流程</text>
  <g filter="url(#shadow)">
    <rect x="60" y="70" width="140" height="70" rx="10" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
    <text x="130" y="95" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#2B6CB0" text-anchor="middle">🌐 浏览器</text>
    <text x="130" y="118" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#4A5568" text-anchor="middle">Vue3 + Element Plus</text>
    <text x="130" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#718096" text-anchor="middle">baoming.cfsedu.cn</text>
  </g>
  <g filter="url(#shadow)">
    <rect x="540" y="70" width="140" height="70" rx="10" fill="#F0FFF4" stroke="#38A169" stroke-width="2"/>
    <text x="610" y="95" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#276749" text-anchor="middle">☕ 后端 Java</text>
    <text x="610" y="118" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#4A5568" text-anchor="middle">JeecgBoot 3.7</text>
    <text x="610" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#718096" text-anchor="middle">Port 7001</text>
  </g>
  <g filter="url(#shadow)">
    <rect x="300" y="240" width="140" height="70" rx="10" fill="#FFFAF0" stroke="#DD6B20" stroke-width="2"/>
    <text x="370" y="265" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#C05621" text-anchor="middle">📦 MinIO</text>
    <text x="370" y="288" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#4A5568" text-anchor="middle">对象存储</text>
    <text x="370" y="302" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#718096" text-anchor="middle">storage.lengmodkx.club</text>
  </g>
  <line x1="200" y1="105" x2="540" y2="105" stroke="#4A5568" stroke-width="2" marker-end="url(#arrowhead)" stroke-dasharray="6,3"/>
  <text x="370" y="96" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#2D3748" text-anchor="middle" font-weight="500">① GET /getMinioPresignedUrl</text>
  <text x="370" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#718096" text-anchor="middle">fileName=xxx.png&amp;biz=</text>
  <line x1="540" y1="125" x2="200" y2="125" stroke="#3182CE" stroke-width="2" marker-end="url(#arrowhead-blue)"/>
  <text x="370" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#2B6CB0" text-anchor="middle" font-weight="500">← 返回 presignedUrl + fileUrl</text>
  <rect x="350" y="55" width="40" height="20" rx="10" fill="#3182CE"/>
  <text x="370" y="69" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="600">步骤1</text>
  <line x1="130" y1="165" x2="340" y2="235" stroke="#DD6B20" stroke-width="2.5" marker-end="url(#arrowhead)"/>
  <text x="200" y="215" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#C05621" text-anchor="middle" font-weight="500">② PUT 直传</text>
  <text x="200" y="230" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#718096" text-anchor="middle">文件流不经过后端</text>
  <rect x="170" y="180" width="40" height="20" rx="10" fill="#DD6B20"/>
  <text x="190" y="194" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="600">步骤2</text>
  <line x1="130" y1="320" x2="540" y2="320" stroke="#38A169" stroke-width="2" marker-end="url(#arrowhead-green)"/>
  <text x="370" y="342" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#276749" text-anchor="middle" font-weight="500">③ POST /confirmUpload</text>
  <text x="370" y="358" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#718096" text-anchor="middle">fileUrl + fileName + fileSize → 入库</text>
  <rect x="340" y="300" width="40" height="20" rx="10" fill="#38A169"/>
  <text x="360" y="314" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="600">步骤3</text>
  <line x1="130" y1="140" x2="130" y2="320" stroke="#4A5568" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
  <rect x="60" y="380" width="680" height="28" rx="6" fill="#EDF2F7"/>
  <text x="400" y="398" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#4A5568" text-anchor="middle">💡 核心优势：文件不再经过后端服务器，直接从浏览器上传到 MinIO，彻底消除后端带宽瓶颈</text>
</svg>
</p>

**后端新增接口**：

```java
/**
 * 获取 MinIO 预签名上传 URL（前端直传使用）
 */
@GetMapping("/getMinioPresignedUrl")
public Result<?> getMinioPresignedUrl(@RequestParam("fileName") String fileName,
                                      @RequestParam(name = "biz", required = false) String biz) {
    // 生成预签名 PUT URL（有效期 5 分钟）
    String presignedUrl = MinioUtil.getPresignedPutUrl(bucketName, objectName, 300, contentType);
    // 返回预签名URL + 最终访问URL
}

/**
 * 前端直传 MinIO 成功后，确认文件入库
 */
@PostMapping("/confirmUpload")
public Result<?> confirmUpload(@RequestParam("fileUrl") String fileUrl,
                               @RequestParam("fileName") String fileName,
                               @RequestParam(name = "fileSize", required = false) Long fileSize) {
    // 保存到文件表
    CfmFile cfmFile = cfmFileService.addSysCommonFile(orgName, fileType, fileUrl, uploadpath);
}
```

**MinioUtil 新增方法**：

```java
public static String getPresignedPutUrl(String bucketName, String objectName, 
                                        int expires, String contentType) {
    GetPresignedObjectUrlArgs.Builder builder = GetPresignedObjectUrlArgs.builder()
            .object(objectName)
            .bucket(bucketName)
            .expiry(expires)
            .method(Method.PUT);
    if (contentType != null) {
        builder.extraHeaders(Collections.singletonMap("Content-Type", contentType));
    }
    return minioClient.getPresignedObjectUrl(builder.build());
}
```

**前端封装上传工具**（`uploadToMinio.ts`）：

```typescript
export async function uploadToMinio(file: File, biz: string = '', onProgress?: (percent: number) => void): Promise<any> {
    // 1. 向后端申请预签名 URL
    const presignRes = await request({ url: '/sys/common/getMinioPresignedUrl', method: 'get', params: { fileName: file.name, biz } })
    const { presignedUrl, fileUrl, contentType } = presignRes.data.result

    // 2. 直传 MinIO
    await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        })
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`MinIO 上传失败: ${xhr.status}`))
        })
        xhr.open('PUT', presignedUrl, true)
        xhr.setRequestHeader('Content-Type', contentType)
        xhr.send(file)
    })

    // 3. 确认入库
    const confirmRes = await request({ url: '/sys/common/confirmUpload', method: 'post', data: { fileUrl, fileName: file.name, fileSize: file.size } })
    return confirmRes.data.result
}
```

**前端组件改造**（以 `el-upload` 为例）：

```vue
<el-upload :http-request="handleUpload" ...>

<script>
const handleUpload = createMinioUploader('')
</script>
```

### 4.4 实施中遇到的坑

**坑 1：Shiro 鉴权拦截（401）**

新接口 `/getMinioPresignedUrl` 和 `/confirmUpload` 默认需要登录 token，但报名系统是门户端（未登录状态）。需要在 `ShiroConfig.java` 中放行：

```java
filterChainDefinitionMap.put("/sys/common/getMinioPresignedUrl", "anon");
filterChainDefinitionMap.put("/sys/common/confirmUpload", "anon");
```

**坑 2：Nginx CORS 跨域**

前端页面域名是 `https://baoming.cfsedu.cn:8443`，直传 MinIO 的地址是 `https://storage.lengmodkx.club:9444`，属于跨域请求。需要在 Nginx 中添加 CORS 配置：

```nginx
location / {
    # CORS 配置
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://baoming.cfsedu.cn:8443' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Max-Age' 1728000 always;
        add_header 'Content-Length' 0 always;
        return 204;
    }
    add_header 'Access-Control-Allow-Origin' 'https://baoming.cfsedu.cn:8443' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range,ETag' always;

    proxy_pass http://127.0.0.1:9001;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
}
```

**坑 3：el-upload 预览拿不到文件地址（response 为 undefined）**

`el-upload` 的 `http-request` 自定义上传中，如果混用 `onSuccess` 回调和 `async` Promise，el-upload 会以 Promise resolve 的值为准（为 `undefined`）。导致 `on-success` handler 中 `response.code` 报错。

**错误写法**：

```typescript
return async (options) => {
    // ...
    onSuccess?.({ code: 0, ... })  // ❌ 混用 onSuccess 和 Promise
}
```

**正确写法**：

```typescript
return async (options) => {
    const { file, onProgress } = options
    const result = await uploadToMinio(file, biz, onProgress)
    file.url = result.url  // 手动设置 url，供预览使用
    return { code: 0, success: true, result, message: result.url }  // ✅ 通过 Promise resolve 返回
}
```

---

## 五、优化效果

| 指标 | 改造前 | 改造后 |
|------|--------|--------|
| 上传一张图片 | ~30 秒 | **3-5 秒** |
| 文件经过服务器 | 是（占用后端带宽） | 否（直传 MinIO） |
| Nginx 超时风险 | 高（30s 阈值） | 低（直传不受后端超时限制） |
| 后端资源占用 | 高（文件流经过 JVM） | 低（只处理 URL 生成和入库） |

---

## 六、总结

这次排查经历了一个完整的链路，从表面现象深挖到架构瓶颈：

1. **400 错误** → 协议解析 bug（客户端发送 HTTP 而非 HTTPS）
2. **504 超时** → 流式上传参数错误（`stream.available()` 不可靠）
3. **30 秒上传** → 架构瓶颈（后端服务器到 MinIO 的网络带宽不足）
4. **最终方案** → 前端直传 MinIO（绕过后端，彻底消除带宽瓶颈）

**关键经验**：

- `MultipartFile.getInputStream().available()` **绝对不要**用于获取文件大小，它只对本地文件流可靠。
- MinIO Java 客户端 8.0.3 版本较老，处理带端点的 URL 时存在已知问题，建议升级。
- 当后端到对象存储的网络成为瓶颈时，**前端直传**是最有效的架构优化方案。
- el-upload 的 `http-request` 自定义上传，要么纯用 Promise resolve 返回值，要么纯用 `onSuccess` 回调，不要混用。

---

*如果这篇文章对你有帮助，欢迎点赞和收藏。*
