# SKYLINES - 个人专属知识库

一个优雅、功能完整的个人知识库网站，支持文章管理、标签分类、全文搜索和数据统计。

## ✨ 功能特性

- 🔐 **用户认证** - Manus OAuth 登录集成
- 📝 **文章管理** - 创建、编辑、删除和查看知识库文章
- 🏷️ **标签分类** - 为文章添加多个标签并按标签筛选
- 🔍 **全文搜索** - 按标题和内容快速检索知识库
- 📊 **个人仪表盘** - 展示最近编辑的文章和统计数据
- 🎨 **优雅设计** - 现代化的蓝灰色主题，支持深色模式
- 📱 **响应式布局** - 完美适配桌面和移动设备

## 🛠️ 技术栈

- **前端**: React 19 + Vite + TailwindCSS 4
- **后端**: Express + tRPC 11
- **数据库**: MySQL/TiDB
- **认证**: Manus OAuth
- **部署**: Vercel

## 📦 项目结构

```
skylines/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # UI 组件
│   │   ├── lib/           # 工具函数
│   │   └── App.tsx        # 主应用
│   └── index.html         # HTML 入口
├── server/                # Express 后端
│   ├── _core/            # 核心配置
│   ├── routers.ts        # tRPC 路由
│   └── db.ts             # 数据库查询
├── drizzle/              # 数据库 Schema
├── package.json
├── vercel.json           # Vercel 部署配置
└── README.md
```

## 🚀 快速开始

### 本地开发

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd skylines
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 并填入您的配置
   ```

4. **推送数据库迁移**
   ```bash
   pnpm db:push
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

   访问 http://localhost:3000

### 生产构建

```bash
pnpm build
pnpm start
```

## 📝 数据库 Schema

### articles 表
- `id` - 文章 ID
- `userId` - 用户 ID
- `title` - 文章标题
- `content` - 文章内容（Markdown）
- `excerpt` - 文章摘要
- `slug` - URL 友好的标识符
- `viewCount` - 阅读次数
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

### tags 表
- `id` - 标签 ID
- `userId` - 用户 ID
- `name` - 标签名称
- `slug` - URL 友好的标识符
- `color` - 标签颜色
- `createdAt` - 创建时间

### articleTags 表
- `articleId` - 文章 ID
- `tagId` - 标签 ID

## 🔌 API 端点

所有 API 端点都通过 tRPC 提供，使用类型安全的调用方式。

### 文章 API
- `articles.list` - 获取文章列表
- `articles.getBySlug` - 通过 slug 获取文章
- `articles.search` - 搜索文章
- `articles.create` - 创建文章
- `articles.update` - 更新文章
- `articles.delete` - 删除文章
- `articles.recent` - 获取最近的文章
- `articles.stats` - 获取统计数据

### 标签 API
- `tags.list` - 获取标签列表
- `tags.create` - 创建标签
- `tags.delete` - 删除标签
- `tags.addToArticle` - 为文章添加标签
- `tags.removeFromArticle` - 从文章移除标签

## 🌐 部署到 Vercel

1. **推送代码到 GitHub**
   ```bash
   git push origin main
   ```

2. **连接到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库
   - 配置环境变量
   - 点击部署

3. **配置自定义域名**
   - 在 Vercel 项目设置中添加自定义域名
   - 更新 DNS 记录

## 📖 使用指南

### 创建文章
1. 登录到仪表盘
2. 点击"新建文章"按钮
3. 填写标题、内容和摘要
4. 添加标签
5. 保存文章

### 管理标签
1. 在仪表盘中点击"管理标签"
2. 创建新标签或编辑现有标签
3. 为文章添加或移除标签

### 搜索文章
1. 在仪表盘中使用搜索框
2. 输入关键词搜索标题或内容
3. 点击搜索结果查看文章

## 🔒 安全性

- 所有 API 端点都需要用户认证
- 用户只能访问自己的数据
- 数据库查询使用参数化防止 SQL 注入
- 环境变量存储敏感信息

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请提交 Issue 或联系开发者。

---

**祝您使用愉快！** ✨
