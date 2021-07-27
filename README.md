<p align="center">
  <a href="https://rxdrag.com/" target="blank"><img src="https://rxdrag.com/img/logo.png" width="200" alt="Nest Logo" /></a>
</p>

 
  <p align="center"><a href="https://rxdrag.com" target="_blank">rxModels</a> 是一个低代码后端服务，基于业务模型生成后端，提供通用查询JSON接口</p>
    <p align="center">


演示地址：https://rxmodels-client.rxdrag.com/login

## Installation
要使用TypeORM CLI创建Models，需要全局安装TypeORM:
```bash
$ npm install -g ts-node
$ npm install typeorm -g  
```
如果sharp安装不成功，在需要设置代理：
npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"   
npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"   
npm install sharp  

安装本项目
```bash
$ npm install
```
配置数据库
```
cp ormconfig-example.json ormconfig.json
```
更新数据库配置 `ormconfig.json`
```
...
  "username": "root",
  "password": "",
  "database": "rxdrag",
...
```

生成数据库 (**需要执行两次**)
```bash
$ npm run typeorm migration:run  
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
