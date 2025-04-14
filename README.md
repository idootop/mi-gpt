# MiGPT

[![npm version](https://badge.fury.io/js/mi-gpt.svg)](https://www.npmjs.com/package/mi-gpt)

首先，安装依赖

```shell
pnpm install
```
安装依赖时候出现Warning:

```
╭ Warning-───────────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│   Ignored build scripts: @prisma/client, @prisma/engines, esbuild, mi-gpt, prisma.         │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.   │
│                                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
```
请按照提示执行命令构建依赖：
```
pnpm approve-builds
```

然后，创建并启动 `MiGPT` 实例，查看如何[「配置参数」](https://github.com/idootop/mi-gpt/tree/main#%EF%B8%8F-%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0)。

```typescript
// index.ts
import { MiGPT } from "mi-gpt";

async function main() {
  const client = MiGPT.create({
    speaker: {
      userId: process.env.MI_USER,
      password: process.env.MI_PASS,
      did: process.env.MI_DID,
    },
  });
  await client.start();
}

main();
```

配置完成后，启动项目。

```
pnpm run start
```
