# 配置相关内容

## Vite 配置 ts

### 需要安装的依赖

```js
    pnpm add typescript -D
```

### tsconfig.json

```ts
{
  "compilerOptions": {
    // 目标
    "target": "esnext",
    // 使用defineForClassFields
    "useDefineForClassFields": true,
    // 模块
    "module": "esnext",
    // 模块解析
    "moduleResolution": "node",
    // 严格模式
    "strict": true,
    // 使用react-jsx
    "jsx": "react-jsx",
    // 跳过库检查
    "skipLibCheck": true,
    // 生成sourceMap
    "sourceMap": true,
    // 解析json模块
    "resolveJsonModule": true,
    // 隔离模块
    "isolatedModules": true,
    // 允许导入es模块
    "esModuleInterop": true,
    // 库
    "lib": ["esnext", "dom"],
    // 允许导入ts扩展
    "allowImportingTsExtensions": true,
    // 不生成文件
    "noEmit": true,
     // 设置types路径
    "typeRoots": ["./node_modules/@types", "./src/types"],
  },
  // TypeScript文件应该进行类型检查
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}

```
