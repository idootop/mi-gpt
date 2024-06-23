# 🛠️ 本地开发

如果你想要修改代码，本地调试开发 `MiGPT` 可以参考以下教程。

## 初始化

```shell
# 克隆项目到本地
git clone https://github.com/idootop/mi-gpt.git
cd mi-gpt

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 运行项目
pnpm dev
```

然后按照 [⚙️ 参数设置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md) 教程，配置好你的 `.env` 和 `.migpt.js` 文件。

## 运行

有两种运行方式：VS Code Debug 或 NPM Script：

- **NPM Script**: 配置好 `.env` 和 `.migpt.js` 后直接使用 `pnpm run dev` 启动 `MiGPT`。
- **VScode Debug**：使用 VS Code 打开项目根目录，然后按 `F5` 开始调试 `MiGPT`。

> 本项目默认在 Node 20 中运行，如果你的 Node 版本过低可能无法正常启动本项目。

## 构建 Docker 镜像

此项目默认支持 `linux/amd64`, `linux/arm64` 和 `linux/arm32/v7`，可使用以下命令构建指定平台的镜像：

```shell
docker build --platform linux/arm/v7 -t mi-gpt .
```

运行构建后的 docker

```shell
docker run -d --env-file $(pwd)/.env -v $(pwd)/.migpt.js:/app/.migpt.js mi-gpt
```

## 常见问题

### 提示找不到 bot，项目启动失败

这是由于重建了本地数据库，导致本地映射记录不匹配。运行以下命令修复：

```shell
pnpm run db:reset
```

或者手动删除以下文件，重新运行即可恢复：

- .mi.json
- .bot.json
- prisma/app.db
- prisma/app.db-journal

### 提示初始化 Mi Service 失败

请检查你的小米 ID 和密码配置是否正确和生效，可在 VS Code 中下断点调试。

### 提示初始化 db 失败

请检查你的项目路径中是否包含中文或空格，应当只包含英文字母、数字和下划线（_）