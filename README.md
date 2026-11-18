# MyBlog

一个使用 **Node.js + Express + Prisma(SQLite)** 搭建的博客系统，包含 JWT 认证与文章管理 API，并在 `web-site/` 目录下附带一个 **React + Vite + Ant Design** 前端。

## 项目结构

```
MyBlog/
├── src/                # 后端源码（Express）
│   ├── controllers/    # 控制器
│   ├── middleware/     # 中间件（JWT 认证、错误处理）
│   ├── routes/         # 路由
│   ├── validators/     # Zod 参数校验
│   └── lib/            # Prisma 客户端
├── prisma/             # Prisma schema 与迁移
├── web-site/           # 前端（React 19 + Vite + Ant Design）
├── .env                # 环境变量（不提交到 Git）
└── package.json
```

## 技术栈

- **后端**：Node.js、Express 5、Prisma 7（SQLite，better-sqlite3 驱动）、JWT（jsonwebtoken）、bcryptjs、Zod
- **前端**：React 19、Vite、Ant Design 6、React Router 7、Axios

## 环境准备

- Node.js >= 20
- npm

## 快速开始

### 1. 克隆项目并安装后端依赖

```bash
git clone https://github.com/<你的用户名>/MyBlog.git
cd MyBlog
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并按需修改：

```bash
cp .env.example .env
```

```env
DATABASE_URL="file:./Database.db"
JWT_SECRET="换成你自己的随机密钥"
```

> `.env` 已在 `.gitignore` 中忽略，不会被提交到 GitHub，请勿泄露其中的密钥。

### 3. 初始化数据库

```bash
npx prisma db push
```

### 4. 启动后端

```bash
npm run dev      # 开发模式（热重载）
npm start        # 生产模式
```

后端默认运行在 http://localhost:3000

### 5. 启动前端（可选）

```bash
cd web-site
npm install
npm run dev
```

前端默认运行在 http://localhost:5173

## API 接口

### 认证

| 方法 | 路径 | 说明 | 需要登录 |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | 注册用户 | ❌ |
| POST | `/api/auth/login` | 登录，返回 JWT | ❌ |
| GET | `/api/auth/me` | 获取当前用户信息 | ✅ |

### 文章

| 方法 | 路径 | 说明 | 需要登录 |
| --- | --- | --- | --- |
| GET | `/api/articles` | 获取文章列表 | ❌ |
| GET | `/api/articles/:id` | 获取单篇文章 | ❌ |
| POST | `/api/articles` | 创建文章 | ✅ |
| PUT | `/api/articles/:id` | 更新文章 | ✅ |
| DELETE | `/api/articles/:id` | 删除文章 | ✅ |

> 需要登录的接口请在请求头中携带：`Authorization: Bearer <token>`

### 其他

- `GET /` — 健康检查，返回 `{ "message": "Hello, World!" }`

## 环境变量说明

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `DATABASE_URL` | SQLite 数据库文件路径 | `file:./Database.db` |
| `JWT_SECRET` | JWT 签名密钥，请使用随机长字符串 | `-` |
| `PORT` | 服务端口（可选，默认 3000） | `3000` |

## License

[MIT](LICENSE)
