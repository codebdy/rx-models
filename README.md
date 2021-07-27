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

# JSON数据接口

rxModels 提供了五个通用JSON接口，用这个五个接口，可以完成增、删、查、改、上传等功能。

接口输入时JSON格式数据，输出也是JSON格式数据。

可以用指令（格式 `@directive`）的方式扩展接口，指令支持热拔插，您可以定义自己指令插入到系统里。

## 接口测试
直接在客户端界面，输入JSON格式的请求，就可以查询或者修改数据。

![API使用]((https://rxdrag.com/img/tutorial/api.jpg)

## /get/...

数据查询接口。

JSON格式的查询参数，编码成url格式，使用 web 请求的 get method 查询。

相比把参数放进Post method 的 body 里，get 有个明显的是优势，就是可以使用基于url的缓存，比如 rxmodels-swr 使用就是 SWR。可以充分使用SWR的缓存机制。

### 请求格式

```
{
  "entity @directive": "EntityName",
  "@directive": true,
  "condition @directive": "xx",
  "relationName":{
    ...
  }
}
```

请求中，以 `@` 开头的就是指令。指令是扩展接口的灵活方式，以后会有越来越多的指令被开发出来。

### 简单示例
分页查询 RxUser 实体，每页2条数据，附带关联 roles 信息。

```json
{
  "entity": "RxUser",
  "roles": {},
  "@paginate":[2,0]
}
```

其中@paginate是一条指令用于分页，目前的版本支持把@paginate指令放在 entity 后面。

```json
{
  "entity @paginate(2, 0)": "RxUser",
  "roles": {}
}
```
这两个请求的查询结果是一样的，目前还不确定哪种方式更好，还是两种方式都需要保留。

### 给查询添加条件
```json
{
  "entity": "RxUser",
  "roles": {},
  "@paginate": [2,0],
  "name @like": "%水%"
}
```
添加 `name` 条件跟指令 `@like` 可以查询名字中包含文字“水”的RxUser实例。

如果想让 RxRole 的 name 字段包含“风”，可以这么写：
```json
{
  "entity": "RxUser",
  "@paginate": [2,0],
  "name @like": "%水%",
  "roles": {
    "name @like": "%风%"
  }
}
```
这个查询会返回所有名字包含“水”的 RxUser，并附带名字中包含“风”的RxRole。

如果要剔除 RxRole 名字中不包含“风”的 RxUser，这个查询是满足不了要求的，需要用到更复杂的 `where` 指令：
```json
{
  "entity": "RxUser",
  "@paginate": [2,0],
  "name @like": "%水%",
  "roles": {},
  "@where": "roles.name like '%风%'"
}
```

`@where` 是内置指令，不写 `@` 也能被识别，不过不建议这样做。

`@where` 指令支持类似与 SQL 的 where语句的语法。

关系里面，有个跟 `@where` 指令类似的 `@on`指令，使用这个指令，可以把上面的例子（就是第二个例子）改为：
```json
{
  "entity": "RxUser",
  "@paginate": [2,0],
  "name @like": "%水%",
  "roles": {
    "@on": "name like '%风%'"
  }
}
```

### 条件指令

可以附加到条件上的指令。既可以附加到实体条件上，也可以附加到关系条件上。

* `@equal`: 如果条件不显式指定，默认就是这个指令。
* `@between`: 接受数组参数如：[2, 5]
* `@like`: 跟SQL的 like 一致

### 实体指令
可以附加到实体上的指令，目前支持前面提到的两种附加方式。

* `@getOne`: 只取第一条记录
* `@getMany`: 取多条记录，如果条件不显式指定，默认就是这个指令
* `@orderBy`: 排序指令，参数格式： `{"name":"ASC", "email": "DESC"}`
* `@paginate`: 分页指令，参数格式：`[coustPerPage, pageIndex]`
* `@select`: 选择要获取的字段，参数格式：`["name", "email"...]`
* `@skip`: 跳过指定数量的记录，参数格式：`count`
* `@take`: 取指定数量的记录，参数格式：`count`
* `@tree`: 如果实体支持树形结构，返回一棵树。注意只能在支持树形结构的实体上使用该指令。
* `@where`: 复杂条件指令，支持 SQL 格式字符串，不要担心安全问题，只是伪 SQL，后端会解析成其它人不容易理解的数据结构，并过滤掉SQL注入攻击。

### 关系指令
可以附加到关系上的指令。
* `@count`: 只取关联数量，不取具体数
* `@on`: 类似于SQL 的 on
* `@orderBy`: 排序，同实体 orderBy指令
* `@select`: 同实体 select指令
* `@take`: 同实体 take指令

## /post

数据提交接口，通过 web post method发送请求。

该接口有新建跟更新两个功能，如果传入的数据有 id 字段，则更新，反之新建。

### 请求格式

```json
{
  "EntityName @directive(arg...)": [
    {
      "id": 1,
      "field": "Field value1"
      ...
    },
    {
      "field": "Field value2",
      "relations @directive(arg...)":[
        3,4,
        {
          "field": "Relation field value"
        }
      ]
      ...
    }
  ],
  "EntityName @directive(arg...)":{
    ...
  }
}
```

跟 get 接口一样，以 `@` 开头的是指令，您可以开发自己的指令来扩展接口。

指令可以附加在实体名称后面，也可以附加在关系名称后面。附加在实体后面的指令，也可以附加在关系后面。反之，则不然。

可以一次传输一条数据，也可以一次传输多条数据。

现在的指令还有点少，希望以后能多发开发一些指令，比如邮件服务的 `@email` 指令，已经在开发计划中了。

### 普通指令
可以附加到关系跟实体上的指令。

* `ignoreEmperty`: 如果字段值为空（null, "", undefined），则会略该字段。格式：`ignoreEmperty(field1, field2...)`
* `bcrypt`: 对字段加密，主要用于用户密码。格式：`bcrypt(field1, field2...)`

### 关系指令
只能附加到关系上的指令。

* `cascade`: 如果关系数据被删除，级联删除关联的对象。

## /update
批量更新某些字段。通过 web post method发送请求。

### 请求格式
```json
{
   "EntityName1":{
     "name":"张三",
     "email":"zhangsan@rxdrag.com",
     "ids":[2,3,5]
   },
   "EntityName2":{
     ...
   }
}
```
基于安全方面因素考虑，update 目前不支持条件，只通过 ids 字段传递一个ID数组。

update 目前不需要指令。

## /delete
根据提供的 ID，删除数据。通过 web post method发送请求。

### 请求格式

```json
{
   "EntityName1 @cascade(pages, auths)":[2,3,5],
   "EntityName2":7,
   ...
}
```

### 指令

目前仅支持一个指令 `@cascade`.

* `@cascade`: 级联删除关联的对象，格式： `@cascade(relations1, relations2...)`

## /upload
上传文件，通过 web post method发送请求。

指令还在开发中...

### 请求格式
```json
{
  "entity":"RxMedia",
  "file":...
  "folder":1
}
```


## 文档

[rxModels文档](https://rxdrag.com/docs/rx-models/install)

## Stay in touch

- Author - 悠闲的水
- Website - [https://rxdrag.com](https://rxdrag.com/)

## License

  rxModels is MIT licensed