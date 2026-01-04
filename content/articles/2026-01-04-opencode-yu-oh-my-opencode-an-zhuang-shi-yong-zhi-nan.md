---
title: OpenCode与oh-my-opencode安装使用指南
date: 2026-01-04
tags:
  - format/tutorial
  - OpenCode
  - oh-my-opencode
  - AI编程助手
  - 安装指南
category: 技术学习
---

# OpenCode与oh-my-opencode安装使用指南

本文档详细介绍OpenCode及其增强插件oh-my-opencode的安装与配置方法，帮助您快速搭建强大的AI编程助手环境。

## 📋 目录

- [概述](#概述)
- [OpenCode简介](#opencode简介)
- [oh-my-opencode简介](#oh-my-opencode简介)
- [OpenCode安装](#opencode安装)
- [oh-my-opencode安装](#oh-my-opencode安装)
- [配置与认证](#配置与认证)
- [核心功能](#核心功能)
- [常见问题](#常见问题)
- [相关资源](#相关资源)

---

## 概述

### 什么是OpenCode？

[OpenCode](https://github.com/sst/opencode) 是一个开源的终端AI编程助手，类似于Claude Code，但具有更强的可扩展性和定制性。它的核心特点：

- 🎯 **零屏幕闪烁** - 流畅的终端体验
- 🔧 **高度可定制** - 无限扩展，完全自定义
- 🤖 **多模型支持** - 混合搭配不同AI模型
- ⚡ **高性能** - 终端不会卡顿
- 🛠️ **LSP集成** - 自动激活语言服务器、linter、格式化工具

### 什么是oh-my-opencode？

[oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) 是OpenCode的终极增强插件，被称为"#1 OpenCode Plugin"。它提供了：

- 🚀 **异步子代理** - 类似Claude Code的并行执行能力
- 👥 **精选代理团队** - 预配置的专业AI助手
- 🔍 **LSP/AST工具** - 强大的代码重构能力
- 📚 **精选MCP服务器** - 扩展功能集成
- 🎭 **Claude Code兼容层** - 无缝迁移现有配置

---

## OpenCode简介

### 核心特性

#### 1. 终端用户界面（TUI）

OpenCode默认启动TUI模式，提供交互式命令行界面：

```bash
opencode  # 启动TUI
```

#### 2. 快捷键

| 操作 | macOS | Windows/Linux |
|:---|:---|:---|
| 快速启动 | `Cmd+Esc` | `Ctrl+Esc` |
| 新会话 | `Cmd+Shift+Esc` | `Ctrl+Shift+Esc` |
| 文件引用 | `Cmd+Option+K` | `Alt+Ctrl+K` |

#### 3. 上下文感知

自动共享当前选择或标签页内容给OpenCode，无需手动复制粘贴。

---

## oh-my-opencode简介

### 设计理念

> *"If Claude Code does in 7 days what a human does in 3 months, Sisyphus does it in 1 hour."*

oh-my-opencode的设计目标是让AI代理像人类团队一样协作工作，而不仅仅是生成代码。

### 核心组件

#### 1. 精选代理团队

| 代理名称 | 模型 | 专长 |
|:---|:---|:---|
| **Sisyphus** | Claude Opus 4.5 | 默认代理，任务编排与执行 |
| **oracle** | GPT-5.2 | 架构设计、代码审查、策略 |
| **librarian** | Claude Sonnet 4.5 / Gemini 3 Flash | 代码库分析、文档查找 |
| **explore** | Grok Code / Gemini 3 Flash | 快速代码库探索 |
| **frontend-ui-ux-engineer** | Gemini 3 Pro High | 前端UI/UX开发 |
| **document-writer** | Gemini 3 Flash | 技术文档写作 |
| **multimodal-looker** | Gemini 3 Flash | PDF、图像、图表分析 |

#### 2. LSP/AST工具集

为AI代理提供真正的IDE级工具：

```javascript
// lsp_hover - 获取类型信息、文档、签名
lsp_hover(filePath, line, character)

// lsp_goto_definition - 跳转到符号定义
lsp_goto_definition(filePath, line, character)

// lsp_find_references - 查找所有使用位置
lsp_find_references(filePath, line, character)

// lsp_rename - 工作区重命名符号
lsp_rename(filePath, line, character, newName)

// ast_grep_search - AST感知的代码搜索
ast_grep_search(pattern, language)

// ast_grep_replace - AST感知的代码替换
ast_grep_replace(pattern, replacement, language)
```

#### 3. 异步后台代理

让多个AI模型并行工作：

```bash
# 场景1: Gemini写前端，Claude处理后端
"让frontend-ui-ux-engineer在后台实现用户界面，
Sisyphus同时处理后端逻辑"

# 场景2: 并行搜索与实现
"启动librarian搜索相关实现，
explore探索代码库模式，
同时oracle进行架构设计"
```

#### 4. 上下文增强

**目录AGENTS.md/README.md注入器**：

```bash
project/
├── AGENTS.md          # 项目级上下文
├── src/
│   ├── AGENTS.md      # src级上下文
│   └── components/
│       ├── AGENTS.md  # 组件级上下文
│       └── Button.tsx
```

读取`Button.tsx`时，自动注入所有层级的AGENTS.md文件。

**条件规则注入器**：

```markdown
---
globs: ["*.ts", "src/**/*.js"]
description: "TypeScript编码规范"
alwaysApply: false
---

- 接口名使用PascalCase
- 函数名使用camelCase
- 组件以.tsx结尾
```

#### 5. Claude Code兼容层

完美兼容Claude Code配置：

- ✅ Hooks集成（PreToolUse、PostToolUse、UserPromptSubmit、Stop）
- ✅ Command加载器（4个目录）
- ✅ Skill加载器
- ✅ Agent加载器
- ✅ MCP加载器
- ✅ 数据存储兼容

---

## OpenCode安装

### 系统要求

- **操作系统**: Windows, macOS, Linux
- **Node.js**: 16.x 或更高版本
- **IDE**: VS Code, Cursor, Windsurf, VSCodium（可选）

### 安装方法

#### 方法1: 使用npm（推荐）

```bash
npm install -g opencode
```

#### 方法2: 使用Bun

```bash
bun install -g opencode
```

#### 方法3: 使用Homebrew（macOS/Linux）

```bash
brew install opencode
```

#### 方法4: 使用安装脚本

```bash
curl -fsSL https://opencode.ai/install.sh | sh
```

### 验证安装

```bash
opencode --version
# 输出: opencode x.x.x
```

### IDE扩展安装（可选）

OpenCode可以与VS Code等IDE集成：

1. **VS Code / Cursor**:
   ```bash
   # 打开VS Code集成终端
   code

   # 在终端中运行
   opencode
   ```

   扩展会自动安装。如需手动安装，在扩展市场搜索"OpenCode"。

2. **确保IDE命令可用**:

   如果`code`命令不可用：
   - VS Code: `Cmd+Shift+P` → "Shell Command: Install 'code' command in PATH"
   - Cursor: 类似步骤
   - Windsurf: `windsurf`命令
   - VSCodium: `codium`命令

---

## oh-my-opencode安装

### 前置条件

确保已安装OpenCode（版本1.0.150或更高）：

```bash
opencode --version
```

### 安装方法

#### 方法1: 交互式安装（推荐）

```bash
bunx oh-my-opencode install
# 或使用npx
npx oh-my-opencode install
```

安装程序会询问：
1. 是否有Claude Pro/Max订阅？
   - 如果是，是否使用max20（20倍模式）？
2. 是否有ChatGPT订阅？
3. 是否需要集成Gemini模型？

根据你的回答自动配置代理模型。

#### 方法2: 非交互式安装

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --chatgpt=yes \
  --gemini=yes
```

**选项说明**：
- `--claude`: `yes`(有订阅), `no`(无订阅), `max20`(20倍模式)
- `--chatgpt`: `yes`(有订阅), `no`(无订阅)
- `--gemini`: `yes`(集成), `no`(不集成)

#### 方法3: 让AI代理安装

将以下内容粘贴到OpenCode会话中：

```
Install and configure by following the instructions here
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/README.md
```

### 验证安装

```bash
# 检查版本
opencode --version  # 应该是1.0.150或更高

# 检查配置
cat ~/.config/opencode/opencode.json
# 应该包含 "oh-my-opencode" 在plugin数组中
```

---

## 配置与认证

### 配置文件位置

OpenCode支持多个配置位置，按优先级合并（不覆盖）：

| 位置 | 用途 | 优先级 |
|:---|:---|:---|
| `~/.config/opencode/opencode.json` | 全局配置 | 1 |
| `<project>/opencode.json` | 项目配置 | 2 |
| `$OPENCODE_CONFIG` | 自定义路径 | 3 |

**示例配置**：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "theme": "opencode",
  "autoupdate": true,
  "plugin": ["oh-my-opencode"]
}
```

### 认证配置

#### 1. Anthropic (Claude)

```bash
opencode auth login
# 选择: Anthropic
# 选择: Claude Pro/Max
# 在浏览器中完成OAuth流程
```

#### 2. Google Gemini (使用Antigravity OAuth)

首先添加认证插件：

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@1.1.2"
  ]
}
```

然后在`oh-my-opencode.json`中配置模型覆盖：

```json
{
  "google_auth": true,
  "agents": {
    "frontend-ui-ux-engineer": {
      "model": "google/gemini-3-pro-high"
    },
    "document-writer": {
      "model": "google/gemini-3-flash"
    },
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

认证：

```bash
opencode auth login
# 选择: Google
# 选择: OAuth with Google (Antigravity)
# 在浏览器中完成登录
```

**多账号负载均衡**：支持最多10个Google账号，自动切换避免限流。

#### 3. OpenAI (ChatGPT Plus/Pro)

首先添加认证插件：

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-openai-codex-auth@4.1.1"
  ]
}
```

**注意**：当前npm版本有bug，建议使用hotfix分支：

```bash
# 编辑 ~/.config/opencode/package.json
{
  "dependencies": {
    "opencode-openai-codex-auth": "code-yeongyu/opencode-openai-codex-auth#fix/orphaned-function-call-output-with-tools"
  }
}

# 安装
cd ~/.config/opencode && bun i
```

认证：

```bash
opencode auth login
# 选择: OpenAI
# 选择: ChatGPT Plus/Pro (Codex Subscription)
# 在浏览器中完成OAuth流程
```

#### 4. 智谱AI GLM-4.7

智谱AI提供了强大的GLM-4.7模型，支持OpenCode集成。

**方法1: 使用官方认证（推荐）**

```bash
opencode auth login
# 选择: Zhipu AI (智谱AI)
# 选择: Zhipu AI Coding Plan
# 输入你的智谱AI API Key
```

**获取API Key**：
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入API Keys页面创建密钥

**方法2: 手动配置Provider**

编辑 `~/.config/opencode/opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "zhipu/glm-4.7",
  "small_model": "zhipu/glm-4-flash",
  "provider": {
    "zhipu": {
      "apiKey": "{env:ZHIPU_API_KEY}",
      "baseURL": "https://open.bigmodel.cn/api/paas/v4/",
      "models": {
        "glm-4.7": {
          "id": "glm-4.7",
          "type": "chat"
        },
        "glm-4-flash": {
          "id": "glm-4-flash",
          "type": "chat"
        }
      }
    }
  }
}
```

设置环境变量：

```bash
# macOS/Linux
echo 'export ZHIPU_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc

# Windows (PowerShell)
[System.Environment]::SetEnvironmentVariable('ZHIPU_API_KEY', 'your-api-key-here', 'User')
```

**可用模型**：
- `zhipu/glm-4.7` - 旗舰模型，200K上下文，128K输出
- `zhipu/glm-4-flash` - 快速模型，适合轻量任务
- `zhipu/glm-4-plus` - 均衡性能模型

**特点**：
- 🚀 编程能力强，支持复杂代码生成
- 📦 200K超长上下文窗口
- 💰 性价比高，提供免费额度
- 🇨🇳 对中文理解优秀

#### 5. MiniMax M2.1

MiniMax M2.1是另一款优秀的国产大模型，特别擅长代码生成和前端开发。

**方法1: 使用官方认证（推荐）**

```bash
opencode auth login
# 选择: MiniMax
# 输入你的MiniMax API Key
# 选择区域（国内/海外）
```

**获取API Key**：
1. 访问 [MiniMax开放平台](https://platform.minimaxi.com/)
2. 注册/登录账号
3. 创建应用并获取API Key和Group ID

**方法2: 手动配置Provider**

编辑 `~/.config/opencode/opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "minimax/minimax-m2.1",
  "provider": {
    "minimax": {
      "apiKey": "{env:MINIMAX_API_KEY}",
      "baseURL": "https://api.minimaxi.com/v1",
      "models": {
        "minimax-m2.1": {
          "id": "minimax-m2.1",
          "type": "chat"
        }
      }
    }
  }
}
```

设置环境变量：

```bash
# macOS/Linux
echo 'export MINIMAX_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc

# Windows (PowerShell)
[System.Environment]::SetEnvironmentVariable('MINIMAX_API_KEY', 'your-api-key-here', 'User')
```

**国内用户配置**：

如果在国内使用，需要指定国内API端点：

```json
{
  "provider": {
    "minimax": {
      "apiKey": "{env:MINIMAX_API_KEY}",
      "baseURL": "https://api.minimaxi.com/v1",
      "options": {
        "region": "cn"
      }
    }
  }
}
```

**海外用户配置**：

```json
{
  "provider": {
    "minimax": {
      "apiKey": "{env:MINIMAX_API_KEY}",
      "baseURL": "https://api.minimax.io/v1",
      "options": {
        "region": "global"
      }
    }
  }
}
```

**可用模型**：
- `minimax/minimax-m2.1` - 旗舰编程模型
- `minimax/minimax-m2.1-pro` - 高性能版本
- `minimax/minimax-m2.1-flash` - 快速响应版本

**特点**：
- 🎨 前端代码生成能力媲美Claude 3.5
- ⚡ 响应速度快
- 🔧 适合UI/UX开发
- 💵 提供免费试用额度

#### 6. 多Provider混合配置

可以同时配置多个Provider，让不同任务使用最适合的模型：

```json
{
  "$schema": "https://opencode.ai/config.json",

  // 主模型 - 使用智谱GLM-4.7
  "model": "zhipu/glm-4.7",

  // 轻量模型 - 使用GLM-Flash
  "small_model": "zhipu/glm-4-flash",

  // Provider配置
  "provider": {
    // 智谱AI配置
    "zhipu": {
      "apiKey": "{env:ZHIPU_API_KEY}",
      "baseURL": "https://open.bigmodel.cn/api/paas/v4/"
    },
    // MiniMax配置
    "minimax": {
      "apiKey": "{env:MINIMAX_API_KEY}",
      "baseURL": "https://api.minimaxi.com/v1"
    },
    // Anthropic配置（如果需要）
    "anthropic": {
      "apiKey": "{env:ANTHROPIC_API_KEY}"
    }
  },

  // 插件
  "plugin": ["oh-my-opencode"]
}
```

#### 7. 在oh-my-opencode中使用国产模型

编辑 `~/.config/opencode/oh-my-opencode.json`，为特定代理配置国产模型：

```json
{
  "$schema": "https://opencode.ai/config.json",

  // 代理配置
  "agents": {
    "sisyphus": {
      "model": "zhipu/glm-4.7",
      "description": "使用GLM-4.7进行任务编排"
    },
    "oracle": {
      "model": "minimax/minimax-m2.1",
      "description": "使用MiniMax M2.1进行架构设计"
    },
    "frontend-ui-ux-engineer": {
      "model": "minimax/minimax-m2.1",
      "description": "使用MiniMax M2.1开发前端UI"
    },
    "librarian": {
      "model": "zhipu/glm-4-flash",
      "description": "使用GLM-4-Flash快速分析代码库"
    },
    "explore": {
      "model": "zhipu/glm-4-flash",
      "description": "使用GLM-4-Flash快速探索代码"
    }
  }
}
```

**成本优化配置**：

使用国产模型可以大幅降低成本：

```json
{
  "agents": {
    // 复杂任务使用GLM-4.7
    "sisyphus": {
      "model": "zhipu/glm-4.7"
    },
    // 快速任务使用GLM-Flash
    "explore": {
      "model": "zhipu/glm-4-flash"
    },
    // 前端使用MiniMax M2.1
    "frontend-ui-ux-engineer": {
      "model": "minimax/minimax-m2.1-flash"
    }
  }
}
```

#### 8. 免费使用方案

**智谱AI免费额度**：
- 新用户注册赠送免费额度
- GLM-4-Flash模型提供更低的费率
- 访问 [智谱AI开放平台](https://open.bigmodel.cn/) 了解详情

**MiniMax免费方案**：
- 提供新用户免费试用额度
- 可通过AI Ping等平台免费使用
- 访问 [MiniMax开放平台](https://platform.minimaxi.com/) 了解详情

### oh-my-opencode配置

创建或编辑`~/.config/opencode/oh-my-opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",

  // Google认证
  "google_auth": true,

  // 代理配置
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "description": "The orchestrator - plans and delegates"
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "description": "Architecture and code review"
    },
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5",
      "description": "Codebase analysis and documentation"
    }
  },

  // 权限配置
  "permissions": {
    "bash": "ask",
    "edit": "auto"
  },

  // MCP服务器
  "mcp": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server-context7"]
    },
    "websearch_exa": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server-exa"]
    }
  },

  // 禁用的技能
  "disabled_skills": [],

  // 实验性功能
  "experimental": {
    "lsp_tool": true,
    "ast_grep": true
  }
}
```

---

## 核心功能

### 1. 代理协作

#### 自动调用

Sisyphus会根据任务自动调用专业代理：

```
"设计并实现一个用户认证系统"
# Sisyphus会：
# 1. 调用oracle进行架构设计
# 2. 调用librarian研究最佳实践
# 3. 调用frontend-ui-ux-engineer实现前端
# 4. 自己处理后端逻辑
```

#### 显式调用

也可以直接指定代理：

```
"@oracle，审查这个API设计并提出改进建议"
"@librarian，找出项目中所有使用useState的地方"
"@explore，查找项目中的错误处理模式"
```

### 2. 后台任务

让代理在后台运行，主代理继续工作：

```
"让frontend-ui-ux-engineer在后台实现用户设置页面，
我们继续处理支付流程"
```

### 3. LSP工具

为AI提供真正的IDE能力：

```
"@librarian，使用lsp_find_references查找这个函数的所有调用，
然后使用lsp_rename将其重命名为更合适的名称"
```

### 4. 上下文管理

#### AGENTS.md层次结构

在项目根目录创建`AGENTS.md`：

```markdown
# 项目上下文

## 技术栈
- Next.js 16
- TypeScript 5
- Tailwind CSS v4

## 编码规范
- 组件放在src/components/
- 使用函数组件和Hooks
- API路由放在src/app/api/
```

在子目录创建特定上下文：

```markdown
# src/components上下文

## 组件规范
- 使用PascalCase命名
- Props接口定义在组件文件顶部
- 导出使用export default
```

#### 条件规则

在`.claude/rules/`创建规则文件：

```markdown
---
globs: ["**/*.test.ts", "**/*.spec.ts"]
description: "测试文件规则"
alwaysApply: false
---

- 测试文件与源文件放在同一目录
- 使用describe和it组织测试
- 每个测试应该有清晰的描述
- Mock外部依赖
```

### 5. 魔法词：`ultrawork`

不想深入配置？只需在提示词中包含`ultrawork`（或`ulw`）：

```
"使用ultrawork模式重构整个前端架构"
```

所有功能（并行代理、后台任务、深度探索）会自动启用。

---

## 常见问题

### Q1: OpenCode安装后命令不可用？

**A**:

1. 检查npm全局路径：
   ```bash
   npm config get prefix
   ```

2. 将npm全局路径添加到PATH：
   ```bash
   # macOS/Linux
   export PATH="$(npm config get prefix)/bin:$PATH"

   # Windows
   # 将npm路径添加到系统环境变量
   ```

3. 或使用完整路径：
   ```bash
   $(npm config get prefix)/bin/opencode
   ```

### Q2: oh-my-opencode安装后未生效？

**A**:

1. 检查OpenCode版本（需要1.0.150+）：
   ```bash
   opencode --version
   ```

2. 检查配置文件：
   ```bash
   cat ~/.config/opencode/opencode.json
   ```

3. 确认plugin数组包含"oh-my-opencode"

4. 重启OpenCode

### Q3: 如何禁用某些功能？

**A**: 在`oh-my-opencode.json`中配置：

```json
{
  // 禁用特定代理
  "disabled_agents": ["frontend-ui-ux-engineer"],

  // 禁用特定技能
  "disabled_skills": ["playwright"],

  // 禁用特定MCP
  "disabled_mcps": ["context7"],

  // 禁用Google认证
  "google_auth": false
}
```

### Q4: 如何自定义代理模型？

**A**: 编辑`oh-my-opencode.json`：

```json
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/o1-preview"
    },
    "librarian": {
      "model": "google/gemini-2-flash"
    }
  }
}
```

### Q5: 如何查看所有可用模型？

**A**:

```bash
opencode models
# 列出所有可用模型

opencode models anthropic
# 列出特定提供商的模型
```

### Q6: Ubuntu/Debian上bunx失败？

**A**: Snap安装的Bun有沙盒限制，使用npx代替：

```bash
npx oh-my-opencode install
```

或重新安装Bun：

```bash
curl -fsSL https://bun.sh/install | bash
```

### Q7: 如何卸载oh-my-opencode？

**A**:

1. 从配置中移除插件：
   ```bash
   jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
       ~/.config/opencode/opencode.json > /tmp/oc.json && \
       mv /tmp/oc.json ~/.config/opencode/opencode.json
   ```

2. 删除配置文件（可选）：
   ```bash
   rm -f ~/.config/opencode/oh-my-opencode.json
   rm -f .opencode/oh-my-opencode.json
   ```

---

## 相关资源

### 官方文档

- **OpenCode官网**: https://opencode.ai
- **OpenCode CLI文档**: https://opencode.ai/docs/cli/
- **OpenCode配置文档**: https://opencode.ai/docs/config/
- **OpenCode IDE文档**: https://opencode.ai/docs/ide/
- **OpenCode GitHub**: https://github.com/sst/opencode

### oh-my-opencode资源

- **GitHub仓库**: https://github.com/code-yeongyu/oh-my-opencode
- **中文文档**: [README.zh-cn.md](https://github.com/code-yeongyu/oh-my-opencode/blob/master/README.zh-cn.md)
- **Discord社区**: https://discord.gg/aSfzWtYxM
- **npm包**: https://www.npmjs.com/package/oh-my-opencode

### 认证插件

- **opencode-antigravity-auth**: https://github.com/NoeFabris/opencode-antigravity-auth
- **opencode-openai-codex-auth**: https://github.com/numman-ali/opencode-openai-codex-auth

### 教程与指南

- **How to Setup & Use Opencode CLI in VS Code** (视频): https://www.youtube.com/watch?v=WYQGc-nyA3g
- **A Deep Dive into Oh My OpenCode**: https://thamizhelango.medium.com/boosting-ai-coding-productivity-with-multi-model-agents-a-deep-dive-into-oh-my-opencode-25ebaf0e8d6b
- **如何安装和使用OpenCode（中文）**: https://onedollarvps.com/zh/blogs/how-to-install-and-use-opencode

### 相关工具

- **Models.dev**: https://models.dev - AI模型提供商列表
- **MCP Registry**: https://modelcontextprotocol.io - Model Context Protocol服务器

### 国产大模型资源

#### 智谱AI GLM-4.7

- **智谱AI开放平台**: https://open.bigmodel.cn/
- **GLM-4.7官方文档**: https://docs.bigmodel.cn/cn/coding-plan/tool/opencode
- **GLM-4 API文档**: https://open.bigmodel.cn/dev/api
- **GLM-4.7技术概览**: https://docs.z.ai/guides/llm/glm-4.7
- **免费使用GLM-4.7完整指南**: https://onedollarvps.com/blogs/how-to-use-glm-4-7-for-free

#### MiniMax M2.1

- **MiniMax开放平台（国内）**: https://platform.minimaxi.com/
- **MiniMax API文档（海外）**: https://platform.minimax.io/docs/coding-plan/opencode
- **在AI编程工具中使用M2.1**: https://platform.minimaxi.com/docs/guides/text-ai-coding-tools
- **AI Ping免费体验GLM-4.7与MiniMax M2.1**: https://www.modelscope.cn/learn/4796
- **用AI Ping免费体验GLM-4.7与MiniMax M2.1（阿里云）**: https://developer.aliyun.com/article/1696537

#### 综合教程

- **AI Ping上新GLM-4.7/MiniMax M2.1保姆级教程**: https://devpress.csdn.net/hangzhou/694d52b1836da3214487b23c.html
- **免费薅羊毛！AI Ping上线GLM-4.7与MiniMax M2.1**: https://www.modelscope.cn/learn/4731
- **GLM-4.7与MiniMax M2.1巅峰对决**: https://zhuanlan.zhihu.com/p/1987220222353101193
- **更懂质感：MiniMax M2.1 vs GLM 4.7评测**: https://news.302.ai/302-ai-benchmark-lab-review-on-minimax-m2-1-vs-glm-4-7/

---

## 快速参考卡

### 常用命令

| 命令 | 说明 |
|:---|:---|
| `opencode` | 启动TUI |
| `opencode run "prompt"` | 非交互模式运行 |
| `opencode auth login` | 配置认证 |
| `opencode models` | 列出可用模型 |
| `opencode session list` | 列出会话 |
| `opencode stats` | 查看使用统计 |

### 快捷键

| 操作 | macOS | Windows/Linux |
|:---|:---|:---|
| 快速启动 | `Cmd+Esc` | `Ctrl+Esc` |
| 新会话 | `Cmd+Shift+Esc` | `Ctrl+Shift+Esc` |
| 文件引用 | `Cmd+Option+K` | `Alt+Ctrl+K` |

### 代理快速调用

| 任务 | 推荐代理 |
|:---|:---|
| 架构设计 | @oracle |
| 代码审查 | @oracle |
| 文档查找 | @librarian |
| 代码探索 | @explore |
| 前端开发 | @frontend-ui-ux-engineer |
| 文档写作 | @document-writer |
| 图像分析 | @multimodal-looker |

### 国产模型快速配置

#### GLM-4.7快速开始

```bash
# 1. 认证
opencode auth login
# 选择: Zhipu AI (智谱AI)

# 2. 设置默认模型
export OPENCODE_MODEL="zhipu/glm-4.7"

# 3. 启动OpenCode
opencode
```

#### MiniMax M2.1快速开始

```bash
# 1. 认证
opencode auth login
# 选择: MiniMax

# 2. 设置默认模型
export OPENCODE_MODEL="minimax/minimax-m2.1"

# 3. 启动OpenCode
opencode
```

#### 成本优化配置示例

```json
{
  "model": "zhipu/glm-4.7",
  "small_model": "zhipu/glm-4-flash",
  "agents": {
    "sisyphus": {
      "model": "zhipu/glm-4.7"
    },
    "frontend-ui-ux-engineer": {
      "model": "minimax/minimax-m2.1-flash"
    },
    "explore": {
      "model": "zhipu/glm-4-flash"
    }
  }
}
```

---

## 结语

OpenCode + oh-my-opencode的组合为开发者提供了强大的AI编程助手。通过合理配置和使用，可以显著提升开发效率和代码质量。

**国产模型优势**：
- 💰 **成本更低** - GLM-4.7和MiniMax M2.1提供极具竞争力的价格
- 🇨🇳 **中文友好** - 对中文理解更深入，文档和注释更自然
- 🚀 **性能优秀** - 在代码生成、前端开发等任务上表现优异
- 📦 **超长上下文** - GLM-4.7支持200K上下文窗口

**记住**：如果不想深入配置，只需在提示词中加入`ultrawork`，所有高级功能会自动启用！

---

**文档版本**: 1.1
**最后更新**: 2026-01-04
**新增内容**: GLM-4.7和MiniMax M2.1配置指南
**维护者**: @your-username
