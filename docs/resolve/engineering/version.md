## 为什么要实现版本更新?

- 为解决用户在长时间停留页面期间因浏览器缓存导致的前端代码/资源版本不一致问题

## 如何实现版本更新?

### Vite + 时间戳

- 新建一个`Vite`插件,在 `build` 时生成 `public/version.json` 文件，内部写入版本号（如时间戳），用于标识构建版本。
- 在 `vite.config.ts` 中使用该插件，并通过 `define: { __APP_VERSION__: JSON.stringify(timestamp) }` 将当前构建版本注入到业务代码中，供前端 JS 访问。
- 每次执行 `vite build`（或 `dev`）时，都会生成新的版本号与新的 `version.json`，从而形成构建版本间的区别。

```js
// versionUpdatePlugin.ts
import fs from "node:fs";
import path from "node:path";

import type { ResolvedConfig } from "vite";

function writeVersion(versionFile: string, content: string) {
  // 写入文件
  fs.writeFile(versionFile, content, (err) => {
    if (err) throw err;
  });
}

export default (version: string | number) => {
  let config: ResolvedConfig;
  return {
    name: "version-update",
    configResolved(resolvedConfig: ResolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig;
    },
    buildStart() {
      // 生成版本信息文件路径
      const file = config.publicDir + path.sep + "version.json";
      // 这里使用编译时间作为版本信息
      const content = JSON.stringify({ version });
      if (fs.existsSync(config.publicDir)) {
        writeVersion(file, content);
      } else {
        fs.mkdir(config.publicDir, (err) => {
          if (err) throw err;
          writeVersion(file, content);
        });
      }
    },
  };
};
```

#### 🚦 路由守卫中校验版本

- 在 Vue Router 的全局守卫中，使用 `axios` 获取服务器最新的 `version.json` 文件：

```js
const res = await axios.get("/version.json");
if (res.data.version !== __APP_VERSION__) {
  window.location.reload(); // 强制刷新，获取最新资源
}
```

- 由于 Vue 是 SPA（单页应用），正常路由跳转不会重新加载 HTML/JS/CSS 资源，所以需要手动进行一次全页刷新。

#### 总结

> “我们通过 `vite` 插件在每次构建时生成 `version.json` 文件，同时将构建版本号注入到全局变量，在路由跳转前做对比。如果发现版本不一致就用 `window.location.reload()` 强制刷新，从而让用户拉取最新资源。这在 Vue 这种单页面架构中尤为重要，因为路由切换本身不会重新加载 JS 和静态资源。”
