# join-us

> 基于vue 的移动端图片上传 （图片压缩）

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
# vue
#手机移动端上传手机图片到服务器并显示，如果直接上传并且传回显示，由于网络状况 或者 上传图片太大造成 图片加载缓慢 并且浪费手机流量 。
#为了提高用户体验，把比较大的图片用canvas进行压缩之后再进行上传。
#在移动端调用拍照功能时，会发生图片旋转，为了解决这个问题引入了exif去判断拍照时的信息再去处理图片。
exif.js (https://github.com/exif-js/exif-js)

#使用方法 

npm install exif-js --save

import Exif from 'exif-js'

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
