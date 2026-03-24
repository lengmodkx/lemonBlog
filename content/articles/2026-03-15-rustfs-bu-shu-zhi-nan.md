---
title: RustFS 部署指南（含 Nginx SSL 反向代理）
date: 2026-03-15
category: 技术学习
tags:
  - RustFS
  - 对象存储
  - Nginx
  - 部署指南
  - 技术文档
  - format/article
---

> 在 Ubuntu 服务器上部署 RustFS 对象存储服务，使用自定义端口 + Nginx SSL 反向代理，避免中国大陆域名备案问题。

## 架构概述

```
用户 → https://storage.lengmodkx.club:9443 → Nginx (SSL) → http://localhost:9000 → RustFS S3 API
用户 → https://storage.lengmodkx.club:9444 → Nginx (SSL) → http://localhost:9001 → RustFS Web 控制台
```

**端口说明**：
- `9000` - RustFS S3 API 端口（仅本地访问）
- `9001` - RustFS Web 控制台端口（仅本地访问）
- `9443` - Nginx HTTPS 端口（S3 API 对外访问）
- `9444` - Nginx HTTPS 端口（Web 控制台对外访问）

---

## 前置要求

- Ubuntu 20.04/22.04/24.04 服务器
- 域名已解析到服务器（如 `storage.lengmodkx.club`）
- 具有 sudo 权限的用户

---

## 1. 安装依赖

```bash
sudo apt update
sudo apt install -y nginx openssl unzip curl
```

> **注意**：`unzip` 是 RustFS 官方安装脚本的必需依赖。

---

## 2. 使用官方脚本安装 RustFS

官方提供一键安装脚本，默认部署**单节点单磁盘模式 (SNSD)**：

```bash
# 下载并执行官方安装脚本
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

**安装说明**：
- 默认端口：`9000`
- 默认数据路径：`/data/rustfs0`
- 安装脚本源码：[GitHub](https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh)

---

## 3. 配置 RustFS systemd 服务

安装完成后，需要手动创建 systemd 服务文件（官方脚本可能不会自动创建）：

### 创建数据目录

```bash
sudo mkdir -p /data/rustfs0
```

### 创建 systemd 服务文件

**注意**：RustFS 命令格式是 `rustfs <目录>`，**不需要 `server` 子命令**！

```bash
sudo tee /etc/systemd/system/rustfs.service << 'EOF'
[Unit]
Description=RustFS Object Storage
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/rustfs /data/rustfs0 --address 127.0.0.1:9000
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF
```

如果 `tee` 命令无法使用，可以用以下替代方案：

**方案 A：使用 cat**
```bash
sudo bash -c 'cat > /etc/systemd/system/rustfs.service' << 'EOF'
[Unit]
Description=RustFS Object Storage
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/rustfs /data/rustfs0 --address 127.0.0.1:9000
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF
```

**方案 B：使用 nano 编辑器**
```bash
sudo nano /etc/systemd/system/rustfs.service
# 然后粘贴内容，按 Ctrl+O 保存，Ctrl+X 退出
```

### 配置环境变量（重要）

官方安装脚本使用 `/etc/default/rustfs` 文件配置环境变量：

```bash
sudo tee /etc/default/rustfs << 'EOF'
RUSTFS_ACCESS_KEY=your-access-key
RUSTFS_SECRET_KEY=your-secret-key
RUSTFS_VOLUMES=/data/rustfs0
RUSTFS_ADDRESS=:9000
RUSTFS_CONSOLE_ADDRESS=:9001
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY=/var/logs/rustfs/
EOF
```

> **⚠️ 注意**：环境变量值**不要加引号**！错误的写法：`RUSTFS_VOLUMES="/data/rustfs0"`，会导致路径解析错误。

> **⚠️ 注意**：`RUSTFS_SECRET_KEY` 中避免使用 `#` 字符，因为在 shell 中 `#` 后面的内容会被视为注释。

### 启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable rustfs
sudo systemctl start rustfs
sudo systemctl status rustfs
```

> **说明**：`--address 127.0.0.1:9000` 表示只监听本地地址，提高安全性（通过 Nginx 反向代理对外提供服务）。

---

## 4. SSL 证书配置（二选一）

### 方案 A：使用阿里云 SSL 证书（推荐）

如果你使用阿里云的免费/付费 SSL 证书，配置方式如下：

#### 1. 下载阿里云证书

在阿里云 SSL 证书控制台：
1. 找到你的域名证书
2. 点击"下载" → 选择 **Nginx** 类型
3. 下载后会得到两个文件：
   - `storage.lengmodkx.club.pem`（证书）
   - `storage.lengmodkx.club.key`（私钥）

#### 2. 上传证书到服务器

```bash
# 在本地执行，将证书上传到服务器
scp storage.lengmodkx.club.pem root@your-server:/tmp/
scp storage.lengmodkx.club.key root@your-server:/tmp/
```

#### 3. 移动证书到 Nginx 目录

```bash
# 创建证书目录
sudo mkdir -p /etc/nginx/ssl

# 移动证书
sudo mv /tmp/storage.lengmodkx.club.pem /etc/nginx/ssl/rustfs.crt
sudo mv /tmp/storage.lengmodkx.club.key /etc/nginx/ssl/rustfs.key

# 设置权限
sudo chmod 600 /etc/nginx/ssl/rustfs.key
sudo chmod 644 /etc/nginx/ssl/rustfs.crt
```

---

### 方案 B：使用自签名 SSL 证书

如果没有阿里云证书，可以生成自签名证书：

```bash
# 创建证书目录
sudo mkdir -p /etc/nginx/ssl

# 生成私钥和证书（有效期 365 天）
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/rustfs.key \
  -out /etc/nginx/ssl/rustfs.crt \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/CN=storage.lengmodkx.club"

# 设置权限
sudo chmod 600 /etc/nginx/ssl/rustfs.key
```

---

## 5. 配置 Nginx 反向代理 + SSL

```bash
sudo tee /etc/nginx/sites-available/rustfs << 'EOF'
server {
    listen 9443 ssl;
    server_name storage.lengmodkx.club;

    # SSL 证书路径
    ssl_certificate /etc/nginx/ssl/rustfs.crt;
    ssl_certificate_key /etc/nginx/ssl/rustfs.key;

    # SSL 配置（兼容自签名和阿里云证书）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 客户端最大上传大小（根据需要调整）
    client_max_body_size 10G;

    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时设置
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }
}
EOF

# 启用配置并检查
sudo ln -sf /etc/nginx/sites-available/rustfs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

### 配置 Web 控制台（可选）

如果需要使用 Web 控制台，单独配置一个端口：

```bash
sudo tee /etc/nginx/sites-available/rustfs-console << 'EOF'
server {
    listen 9444 ssl;
    server_name storage.lengmodkx.club;

    ssl_certificate /etc/nginx/ssl/rustfs.crt;
    ssl_certificate_key /etc/nginx/ssl/rustfs.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/rustfs-console /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> **⚠️ 注意**：RustFS v1.0.0-alpha 版本的 Web 控制台有已知 Bug，可能出现 `SignatureDoesNotMatch` 登录错误。建议使用 [mc 命令行客户端](#使用mc命令行客户端) 代替。

---

## 6. 开放防火墙端口

```bash
# 开放 9443 端口（S3 API 对外 HTTPS）
sudo ufw allow 9443/tcp

# 开放 9444 端口（Web 控制台对外 HTTPS，如需要）
sudo ufw allow 9444/tcp

# 不开放 9000/9001（RustFS 只接受本地连接，更安全）
```

---

## 7. 启动所有服务

```bash
# 测试 Nginx 配置
sudo nginx -t

# 启动 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# 确保 RustFS 在运行
sudo systemctl status rustfs
```

---

## 8. 访问方式

| 协议    | URL                                   | 用途            |
| ----- | ------------------------------------- | ------------- |
| HTTPS | `https://storage.lengmodkx.club:9443` | S3 API 访问（推荐） |
| HTTPS | `https://storage.lengmodkx.club:9444` | Web 控制台（如配置）  |
| HTTP  | `http://storage.lengmodkx.club:9000`  | S3 API（已被阻止）  |
| HTTP  | `http://storage.lengmodkx.club:9001`  | 控制台（已被阻止）     |

### 默认账号

根据 `/etc/default/rustfs` 配置：
- **Access Key**: 你设置的 `RUSTFS_ACCESS_KEY` 值
- **Secret Key**: 你设置的 `RUSTFS_SECRET_KEY` 值

> **提示**：如果 Web 控制台登录失败，请使用 [mc 命令行客户端](#使用mc命令行客户端) 管理存储桶。

---

## 9. 浏览器 SSL 警告处理

由于是自签名证书，浏览器会显示"不安全"警告：

### Chrome/Edge 临时访问
1. 访问 `https://storage.lengmodkx.club:9443`
2. 点击"高级" → "继续前往"
3. 即可正常使用

### 永久信任证书（可选）
1. 从服务器下载证书文件：`/etc/nginx/ssl/rustfs.crt`
2. 双击证书文件 → 选择"安装证书"
3. 选择"本地计算机" → "将所有证书放入下列存储"
4. 选择"受信任的根证书颁发机构"
5. 完成后重启浏览器

---

## 常用管理命令

```bash
# 查看 RustFS 状态
sudo systemctl status rustfs

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看 RustFS 日志
sudo journalctl -u rustfs -f

# 或者直接查看 RustFS 日志文件
sudo tail -f /var/log/rustfs/*.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 重启服务
sudo systemctl restart rustfs
sudo systemctl restart nginx

# 查看端口监听
sudo ss -tlnp | grep -E "9000|9001|9443|9444"
```

---

## 使用mc命令行客户端

由于 RustFS v1.0.0-alpha 版本的 Web 控制台存在登录 Bug，推荐使用 MinIO 客户端 (`mc`) 进行管理：

### 安装 mc

```bash
cd ~
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

### 配置连接

```bash
# 添加 RustFS 别名
mc alias set rustfs http://127.0.0.1:9000 your-access-key your-secret-key

# 测试连接
mc ls rustfs
```

### 常用操作

```bash
# 创建存储桶
mc mb rustfs/my-bucket

# 上传文件
mc cp /path/to/file rustfs/my-bucket/

# 下载文件
mc cp rustfs/my-bucket/file ./local-file

# 查看文件列表
mc ls -r rustfs/my-bucket

# 查看桶信息
mc stat rustfs/my-bucket

# 删除文件
mc rm rustfs/my-bucket/file

# 删除存储桶
mc rb rustfs/my-bucket
```

---

## 配置调整

### 修改上传文件大小限制

编辑 `/etc/nginx/sites-available/rustfs`，修改：
```nginx
client_max_body_size 50G;  # 根据需要调整
```

然后重载 Nginx：
```bash
sudo systemctl reload nginx
```

### 更新 SSL 证书

证书有效期为 365 天，到期前重新生成：
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/rustfs.key \
  -out /etc/nginx/ssl/rustfs.crt \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/CN=storage.lengmodkx.club"

sudo systemctl reload nginx
```

---

## 常见问题排查

### Q1: curl 下载脚本失败，提示"权限不够"

**现象**：
```
Warning: Failed to create the file install_rustfs.sh: 权限不够
curl: (23) Failure writing output to destination
```

**原因**：在根目录 `/` 下执行，普通用户没有写入权限。

**解决**：切换到用户主目录执行：
```bash
cd ~
curl -O https://rustfs.com/install_rustfs.sh && sudo bash install_rustfs.sh
```

---

### Q2: 提示 "This script must be run as root"

**现象**：
```
[ERROR] This script must be run as root. Please use sudo or switch to the root user.
```

**解决**：使用 `sudo` 执行安装脚本：
```bash
sudo bash install_rustfs.sh
```

---

### Q3: 提示 "RustFS appears to be already installed"

**现象**：
```
[ERROR] RustFS appears to be already installed. Please use 'Upgrade' or 'Uninstall'.
```

**解决**：
- 如需重新安装：先选 **2 (Uninstall)**，再重新执行脚本选 **1 (Install)**
- 如需升级：选 **3 (Upgrade)**

---

### Q4: 安装后 `which rustfs` 找不到命令

**现象**：安装完成后执行 `which rustfs` 没有输出。

**原因**：安装脚本可能没有正确下载二进制文件，导致 `/usr/local/bin/rustfs` 是空文件。

**解决**：
```bash
# 1. 检查文件大小
ls -la /usr/local/bin/rustfs
# 如果显示 0 字节，说明下载失败

# 2. 删除损坏的文件
sudo rm -f /usr/local/bin/rustfs

# 3. 重新安装
sudo bash ~/install_rustfs.sh
```

---

### Q5: 没有 systemd 服务文件

**现象**：
```
No files found for rustfs.service.
```

**原因**：官方安装脚本可能没有自动创建 systemd 服务。

**解决**：手动创建服务文件：

```bash
sudo tee /etc/systemd/system/rustfs.service << 'EOF'
[Unit]
Description=RustFS Object Storage
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/rustfs server /data/rustfs0 --address 127.0.0.1:9000
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable rustfs
sudo systemctl start rustfs
```

---

### Q6: 没有 /data 目录

**现象**：安装后 `ls /data` 提示目录不存在。

**原因**：官方脚本可能没有自动创建数据目录，或者下载过程中断。

**解决**：手动创建：
```bash
sudo mkdir -p /data/rustfs0
sudo chown root:root /data/rustfs0
```

---

### Q7: 启动报错 "Volume not found"

**现象**：
```
[FATAL] Server encountered an error and is shutting down: Volume not found
```

**原因**：
1. `/data/rustfs0` 目录不存在
2. systemd 服务文件中命令格式错误（多了 `server` 子命令）

**解决**：

**步骤 1**：确保目录存在
```bash
sudo mkdir -p /data/rustfs0
```

**步骤 2**：修正 systemd 服务文件

❌ **错误的写法**（有 `server`）：
```ini
ExecStart=/usr/local/bin/rustfs server /data/rustfs0 --address 127.0.0.1:9000
```

✅ **正确的写法**（去掉 `server`）：
```ini
ExecStart=/usr/local/bin/rustfs /data/rustfs0 --address 127.0.0.1:9000
```

**步骤 3**：重载并重启
```bash
sudo systemctl daemon-reload
sudo systemctl restart rustfs
```

---

### Q8: systemd 服务文件无法保存

**现象**：执行 `sudo tee` 命令后无法正常退出或保存。

**解决**：使用其他方式创建文件

**方案 A**：使用 cat
```bash
sudo bash -c 'cat > /etc/systemd/system/rustfs.service' << 'EOF'
[Unit]
Description=RustFS Object Storage
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/rustfs /data/rustfs0 --address 127.0.0.1:9000
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF
```

**方案 B**：使用 nano 编辑器
```bash
sudo nano /etc/systemd/system/rustfs.service
# 粘贴内容后，按 Ctrl+O 保存，Ctrl+X 退出
```

**方案 C**：使用 vim
```bash
sudo vim /etc/systemd/system/rustfs.service
# 粘贴内容后，按 Esc，输入 :wq 保存退出
```

---

### Q9: 防火墙已开放但无法访问

**排查步骤**：
```bash
# 1. 检查服务是否运行
sudo systemctl status rustfs
sudo systemctl status nginx

# 2. 检查端口监听
sudo ss -tlnp | grep -E "9000|9443"

# 3. 检查防火墙状态
sudo ufw status
sudo iptables -L -n | grep 9443

# 4. 本地测试
curl -k https://127.0.0.1:9443
```

---

### Q10: 启动报错 "Volume not found"（环境变量问题）

**现象**：日志显示 `Volume not found`，服务反复重启

**原因**：`/etc/default/rustfs` 中环境变量值带有引号，如：
```bash
RUSTFS_VOLUMES="/data/rustfs0"  # ❌ 错误
```

**解决**：去掉引号
```bash
sudo tee /etc/default/rustfs << 'EOF'
RUSTFS_ACCESS_KEY=your-access-key
RUSTFS_SECRET_KEY=your-secret-key
RUSTFS_VOLUMES=/data/rustfs0
RUSTFS_ADDRESS=:9000
RUSTFS_CONSOLE_ADDRESS=:9001
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY=/var/logs/rustfs/
EOF

sudo systemctl restart rustfs
```

**验证**：
```bash
sudo cat /proc/$(pgrep rustfs)/environ | tr '\0' '\n' | grep RUSTFS
```

---

### Q11: Web 控制台登录失败 "SignatureDoesNotMatch"

**现象**：Web 控制台登录时返回 403，日志显示 `SignatureDoesNotMatch` 错误，但 S3 API 工作正常

**原因**：RustFS v1.0.0-alpha 版本 Web 控制台存在已知 Bug（[Issue #2261](https://github.com/rustfs/rustfs/issues/2261)）

**解决**：使用 mc 命令行客户端代替 Web 控制台

```bash
# 安装 mc
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# 配置连接
mc alias set rustfs http://127.0.0.1:9000 your-access-key your-secret-key

# 使用 mc 管理存储桶
mc mb rustfs/my-bucket      # 创建存储桶
mc cp file rustfs/bucket/   # 上传文件
mc ls rustfs                # 查看存储桶列表
```

---

### Q12: Nginx 反向代理后 S3 客户端报 403 "SignatureDoesNotMatch"

**现象**：
- mc 直连 `http://127.0.0.1:9000` 正常
- 通过 Nginx HTTPS 连接报 `SignatureDoesNotMatch` 错误
- Java/AWS SDK 上传文件返回 403

**原因**：Nginx 默认的 `proxy_set_header Host $host;` 丢失了客户端请求的端口号，导致 S3 签名验证时 Host 头不匹配。

**解决**：修改 Nginx 配置，使用 `$http_host` 保留原始端口：

```nginx
location / {
    proxy_pass http://127.0.0.1:9000;

    # ✅ 正确：保留客户端请求的 Host（含端口）
    proxy_set_header Host $http_host;

    # ❌ 错误：$host 不包含端口，会导致签名不匹配
    # proxy_set_header Host $host;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

重载配置：
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

### Q13: 文件上传成功但无法通过 URL 访问（403 Forbidden）

**现象**：
- 文件上传成功，mc 可以列出文件
- 通过浏览器访问文件 URL 返回 403 Forbidden
- curl 测试也返回 403

**原因**：RustFS 存储桶默认是私有的，不允许匿名访问。

**解决**：设置存储桶为公开只读：

```bash
# 设置 bucket 为公开只读（允许任何人访问文件）
mc anonymous set download local/your-bucket

# 验证设置
mc anonymous get local/your-bucket
```

**安全提示**：
- `download` 策略允许任何人读取文件，但不能列出存储桶内容或上传/删除文件
- 如需更细粒度控制，使用预签名 URL（在代码中实现）

---

### Q14: 芋道/Yudao 框架集成 S3 配置要点

**配置示例**：

| 配置项 | 值 | 说明 |
|-------|-----|------|
| 接入点 (Endpoint) | `https://storage.lengmodkx.club:9443` | Nginx HTTPS 地址 |
| 存储 bucket | `cfedu` | 需预先创建 |
| accessKey | `cfedu` | 与 RUSTFS_ACCESS_KEY 一致 |
| secretKey | `lemon2judy` | 与 RUSTFS_SECRET_KEY 一致 |
| 区域 (Region) | `us-east-1` | RustFS 不校验，但必须有 |
| 路径样式访问 | `true` | **必须启用！** |

**代码修改**：

如果 `S3FileClient.java` 生成的是 virtual-hosted-style URL（如 `https://bucket.host/...`），需改为 path-style：

```java
@Override
public String getFileUrl(String path) {
    // ❌ 原来可能是 virtual-hosted-style
    // return String.format("https://%s.%s/%s", bucketName, endpoint, path);

    // ✅ 改为 path-style
    return String.format("https://%s/%s/%s", endpoint, bucketName, path);
}
```

---

## 参考链接

- [RustFS 官方文档](https://docs.rustfs.com/installation/linux/quick-start.html)
- [RustFS GitHub](https://github.com/rustfs/rustfs)
- [官方安装脚本源码](https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh)
- [Nginx 反向代理配置官方文档](https://docs.rustfs.com/integration/nginx.html)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [阿里云 SSL 证书文档](https://help.aliyun.com/document_detail/28546.html)

---

**创建于**: 2026-03-15
**最后更新**: 2026-03-24（添加 Nginx Host 头配置、存储桶权限设置、芋道框架集成等常见问题）
