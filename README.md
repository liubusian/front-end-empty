# front-end-empty

參考[scss-jquery-boilerplate](https://github.com/harishekhar/scss-jquery-boilerplate.git)之架構調整自己適用之空白專案

2021-01-02

- 新增 html-loader
- 調整`webpack.config.js`設定，切割 html 區塊為 partials
- 移除 `scss-jquery-boilerplate` 之檔案結構
- 新增 static resource 打包支援

2020-12-31

- 新增 `clean-webpack-plugin` 以便編譯時清除舊的檔案
- 新增 `postcss + autoprefixer` 自動增加瀏覽器 CSS 前輟
- 調整 `npm run build` 打包方式
