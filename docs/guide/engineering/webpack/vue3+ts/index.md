## 支持 TS

### 需要安装的包

- `@types/webpack`
- `@types/webpack-dev-server`
- `ts-loader`
- `ts-node`
- `typescript`

### 配置文件

#### webpack

```ts
## webpack.config.ts

import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  mode: "development",
  // 配置入口
  entry: "./src/main.ts",
  // 配置出口
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name]_[chunkhash:8].js",
    clean: true,
  },
  module: {
    rules: [
        // 配置ts文件
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".json"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    port: 9000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

export default config;
```

#### tsconfig

```json
## tsconfig.ts

{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ESNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": true,
    "strict": true,
    "skipLibCheck": true
  },
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS"
    }
  }
}
```

## 支持 Vue 以及 Scss

### 需要安装的包

```js
    pnpm add vue vue-loader --save-dev
    pnpm add sass sass-loader -D
    pnpm add css-loader style-loader postcss-loader postcss-preset-env -D
```

### 配置 webpack

```ts
import { VueLoaderPlugin } from "vue-loader";
import { DefinePlugin } from "webpack";

const config = {
    ...,
    module: [
        rules: [
            ...,
            {
                test: /\.vue$/,
                use: "vue-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss)$/,
                use: [
                "style-loader",
                "css-loader",
                {
                    loader: "postcss-loader",
                    options: {
                    postcssOptions: {
                        plugins: ["postcss-preset-env"],
                    },
                    },
                },
                "sass-loader",
                ],
            },
        ],
        plugins: [
            new VueLoaderPlugin(),
            new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(false), // 是否开启 Options API（Vue2 风格）
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // 生产环境是否开启 devtools 支持
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // SSR hydration mismatch 报错详情
            }),
        ]
    ]
}
```

### postcss

```ts
## postcss.config.ts

module.exports = {
  plugins: [
    "postcss-preset-env", // 自动添加css前缀
  ],
};


## .browserslistrc

> 1%
last 2 versions
not dead
```

### 声明 Vue 类型

```ts

## src/types/shims-vue.d.ts

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

## tsconfig.json
{
    "compilerOptions": {
        ...,
        "typeRoots": [
        "./node_modules/@types",
        "./src/types"
      ]
    }
}
```
