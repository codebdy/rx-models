<p align="center">
  <a href="https://rxdrag.com/" target="blank"><img src="https://rxdrag.com/img/logo.png" width="200" alt="Nest Logo" /></a>
</p>

 
  <p align="center"><a href="https://rxdrag.com" target="_blank">rxModels</a> 是一个低代码后端服务，基于业务模型生成后端，提供通用查询JSON接口</p>
    <p align="center">


演示地址：https://rxmodels-client.rxdrag.com/login

## 安装服务端
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

## 安装运行客户端
```console
#跟服务端一样，第一条命令可以通过下载并解压zip包代替

git clone https://github.com/rxdrag/rx-models-client.git

cd rx-models-client

npm install

npm run start
```
命令执行成功后，在浏览器输入：http://localhost:3001/install，显示只有两步的安装向导。在第一页输入MySql用到的数据库信息

![第一步](https://rxdrag.com/img/tutorial/install1.jpg)

在第二页输入超级管理员账号账号密码。勾选“安装演示账号”选项，会添加一个用户名密码为demo/demo的演示账号，演示账号只有读权限没有写权限

![第二步](https://rxdrag.com/img/tutorial/install2.jpg)

这步能够成功执行，那么rxModels就安装成功了，安装完成后会自动跳转到登录页面。

安装过程中有任何问题欢迎发issue或者联系作者。


## 文档

[rxModels文档](https://rxdrag.com/docs/rx-models/install)

## Stay in touch

- Author - 悠闲的水
- Website - [https://rxdrag.com](https://rxdrag.com/)

## License

  rxModels is MIT licensed