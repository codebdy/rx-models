<p align="center">
  <a href="https://rxdrag.com/" target="blank"><img src="https://rxdrag.com/img/logo.png" width="200" alt="Nest Logo" /></a>
</p>

 
  <p align="center"><a href="https://rxdrag.com" target="_blank">rxModels</a> 是一个低代码后端服务，基于业务模型生成后端，提供通用查询JSON接口</p>
    <p align="center">


演示地址：https://rxmodels-client.rxdrag.com/login

## Installation
```console
#不用下面第一条命令，直接在Github网站上Download一个zip格式的代码包，然后解压也很方便

git clone https://github.com/rxdrag/rx-models.git

cd rx-models

npm install

npm run start:dev
```
在浏览器输入：http://localhost:3001/ ，看到熟悉的“Hello World!”，则说明已经成功运行了。

服务端使用了Sharp图形处理库来管理图片，这个库不设置代理，可能不容易安装成功，如果在`npm install`时没有成功，那么按照下面的命令，设置一下代理
```console
npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"

npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
```
设置完成以后再执行命令
```console
npm install

npm run start:dev
```

## 文档

[rxModels文档](https://rxdrag.com/docs/rx-models/install)

## Stay in touch

- Author - 悠闲的水
- Website - [https://rxdrag.com](https://rxdrag.com/)

## License

  rxModels is MIT licensed