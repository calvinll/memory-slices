# 记忆切片（memory-slices）

一个用于验证 **uni-app（Vue3 + Vite + TypeScript）** 跨端开发链路的轻量 App Demo。

当前已实现最小闭环：
- 首页：读取本地存储的记忆卡片列表
- 新建页：选图 + 输入文字 + 选择心情（开心/难过/平静）
- 保存后回到首页，新卡片置顶

> 说明：数据仅存本地（`uni.setStorageSync`），不同设备/不同用户之间不会同步。

## 技术栈

- uni-app + Vue 3 + TypeScript + `<script setup>`
- Pinia
- UI：uview-plus（部分表单交互在 H5 端使用了原生组件兜底以保证可用）

## 开发环境要求

- Node.js 18+ / 20+（建议）
- npm

## 本地启动

安装依赖：

```bash
npm install
```

### H5

```bash
npm run dev:h5
```

终端会输出本地预览地址，例如：

- http://localhost:5173/

### 微信小程序

```bash
npm run dev:mp-weixin
```

然后打开 **微信开发者工具** → 导入项目目录：

- `dist/dev/mp-weixin`

## 构建

### H5 构建

```bash
npm run build:h5
```

产物目录：

- `dist/build/h5/`

## 部署（GitHub Pages + Actions）

本项目推荐使用 GitHub Actions 自动构建并发布到 GitHub Pages。

### 1) 配置 GitHub Pages

在 GitHub 仓库：

- Settings → Pages
- Build and deployment → Source：选择 **GitHub Actions**

### 2) 添加工作流

在仓库创建文件：

- `.github/workflows/deploy-pages.yml`

内容见下方（复制即可）。提交并 push 到 `main` 后会自动部署。

> 部署完成后，Pages 会给你一个访问地址：
> `https://<username>.github.io/<repo>/`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build H5
        run: npm run build:h5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/build/h5

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

## Roadmap

- 详情页：记忆卡片详情展示
- 生成分享图：canvas 合成照片 + 文字 + 日期
- 微信分享：保存到相册 / 分享给朋友
