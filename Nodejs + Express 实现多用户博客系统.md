# 1 课程介绍
实现多用户博客系统
功能实现：
1. 用户认证登录
2. 注册用户
3. 创建博客、更新编辑博客

多博客用户系统的原理
* 后端 Nodejs & Express
* pug 模板引擎
* passport 认证系统
* mongodb
* bower 管理前端
* cookies 操作
* express-messages && express-session && express-validator && connect-flash

# 2 搭建项目代码
1. 创建新文件夹
2. `npm init -y `不回车的仓库初始化生成package.json文件
3. 创建入口文件app.js
4. 安装express库`cnpm install express --save`
5. 安装nodemon工具 `npm install nodemon --save-dev`
6. 更改配置文件的scripts `"scripts": {"start": "nodemon app"}`

# 3 pug 模板引擎
旧版本‘Jade’
去掉了html的标签，还去掉了缩进，代码更明朗清晰
<a href='https://github.com/pugjs/pug'>github地址</a>
文件扩展名是.pug

动态传递数据
```
//定义路由,传递变量
app.get('/', function(req, res) {
  res.render('index',{
     title:'yanjie1995'
  });  //直接识别渲染index.pug文件的内容，传递变量，参数对象
})
------------------------------------------
pug文件
#{title}   //调用显示数据
```
重复代码放到布局文件layout.pug
```
block content   //放置位置，可以被代替
extends layout  //继承文件
然后重写占位置的内容
```

# 4 mongodb 数据库安装与使用
<a href='http://www.runoob.com/mongodb/mongodb-window-install.html'>windows平台MongoDB数据库的安装</a>
1. 客户端安装
2. 数据库数据路径选择
3. 环境变量的更改
4. 启动MongoDB服务，数据管理

启动MongoDB服务——net start MongoDB
关闭MongoDB服务——net stop MongoDB
移除 MongoDB 服务——C:\mongodb\bin\mongod.exe --remove

`db.articles.find()`与`db.articles.find().pretty()`的区别
安装插件使mongo 命令行客户端高亮起来——<a href='https://github.com/TylerBrock/mongo-hacker'>mongo-hacker </a>

# 5 nodejs 使用 mongoose 连接 Mongodb 数据库
官方最底层的库(用来连接MongoDB)——node-mogodb-native(这个库需要写很多代码)

**Mongoose**
<a href='https://mongoosejs.com/docs/guide.html'>官方文档</a>

1. 安装mongoose库`npm install mongoose --save`
2. 单独的model文件存储表单内容
3. 监听数据库的动态

#### Mongoose决定：
//名字的来由：find找的collection之前数据库创建的articles，Mongoose决定复数形式的collection名字
//Article——articles(数据库中collection的名字)

# 6 保存文章到 Mongodb
创建表单显示数据
与HTML是差不多的
.form-control、.form-group是一个class，bootstrap 提供的，就是一个 css 的 class,详见 bootstrap 官网的 form
```
extends layout

block content
  h1 #{title}
  form(method="post", action="/articles/create")
    .form-group
      label Title:
      input.form-control(name="title", type="text")
    .form-group
      label Author:
      input.form-control(name="author", type="text")
    .form-group
      label Body:
      textarea.form-control(name="body")
    br
input.btn.btn-primary(type="submit", value="Submit")
```

body-parser库引入

# 7 用 bower 来管理 bootstrap 和 jquery
引入bootstrap的css文件
bower来管理静态文件——中间件

1. 安装<a href='https://bower.io/'>bower</a> `npm install -g bower`
类似npm，可以用来安装一些库
Npm installs packages to node_modules/
Bower installs packages to bower_components/.
2. 配置文件.bowerrc改包的路径位置
```
{
    "directory": "public/bower_components"
}
```
3. 安装bootstrap `bower install bootstrap`

页面引入
`link(rel="stylesheet", href="/bower_components/bootstrap/dist/css/bootstrap.css")`

导航条直接复制参考就可以
HTML-JADE<a href='https://html2jade.org/'>代码转换</a>

# 8 显示文章的内容
1. 增加跳转链接——a标签
2. 增加跳转路由——动态id
3. 增加显示页面的模板

# 9 修改文章的内容
1. 增加修改的按钮——注意按钮版本（btn-primary 因为bootstrap v4版本）
2. 修改页面的路由
3. 修改页面的模板
带id知道修改的文章id
4. 更新后数据上传需要知道id

# 10 删除文章
1. 删除按钮`a.btn.btn-danger.delete-article(href="#", data-id=article._id) Delete` （绑定属性 data-属性）
delete请求用jquery获取id内容，发送ajax请求实现delete方法

jquery代码，class选中.data-delet
报错：Uncaught TypeError: Cannot read property 'fn' of undefined
先调用jquery库,再用bootstrap（因为bootstrap会用到jquery的东西）

2. 删除按钮调用的事件——ajax请求
3. 删除跳转的页面

实现删除功能，除了通过id在数据库找到并删除该条数据之外，还有一步“用ajax，通过把id发送到服务器，服务器根据id找到这条数据，然后删除“，想问，服务器删除掉的是什么？缓存吗？session？还是别的什么？
是数据，数据库的一条记录

# 11 显示 flash 信息
显示提示信息
flash信息基于session实现，参数带到另一个页面。session可以使数据在不同页面、不同请求共享。无状态的。
express——<a href='https://github.com/expressjs/session'>session库</a>
可以基于cookies来存储信息（浏览器数据库）

express-<a href="https://github.com/visionmedia/express-messages">messages库</a>——解决flash显示
携带安装<a href="https://github.com/jaredhanson/connect-flash">connect-flash</a>
操作什么就在哪里导入显示flash的语句

# 12 表单验证
<a href="https://github.com/express-validator/express-validator">express-validator库</a>实现表单验证功能
<a href="https://express-validator.github.io/docs/custom-error-messages.html">官方文档</a>
express-validator is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.
validator.js——字符串的验证器

表单格式不对就显示错误信息
验证方法看文档
1. 引入验证的语句
2. 在提交表单的路由上验证表单内容格式是否有问题
3. 传递错误的信息到主页面上（参数传递）

# 13 使用路由中间件重构代码
article相关路由放置一起，重构路由
单独抽出一定要注意路径
布局文件也一起单独抽出为一个文件夹

# 14 显示注册用户的表单
创建用户：创建表的记录+密码加密
model放置user用户，路由——创建页面的表单

# 15 注册页面表单验证
实现注册功能——表单数据内容合理就存储
<a href="https://stackoverflow.com/questions/46011563/access-request-body-in-check-function-of-express-validator-v4/46013025#46013025">验证的参考网站</a>

# 16 注册功能加密密码保存到数据库
密码加密的库——<a href="https://github.com/kelektiv/node.bcrypt.js/">node.bcrypt.js</a>

model放置在一个user中
直接使用文档加密密码

# 17 登录页面和 cookies 概念
用户已经注册好
登录页面——路由跳转

登录逻辑——session、cookies
Application的浏览器缓存——HTTP是无状态协议，每个请求之间是没有联系的，不可以标记为同个用户发送请求，可以记录同个IP。
浏览器数据库——Local Storage、Session Storage（服务器端的会话，存在redies端）、Cookies（浏览器自动发送）

# 18 登录认证工具 passport 介绍
登陆逻辑：
1. 输入用户名、密码到服务器端验证是否存在
2. 若存在，再验证密码是否匹配，如果全中，就成功
返回cookies到浏览器中，头信息方式返回，浏览器登陆过的状态

<a href="https://github.com/jaredhanson/passport">passport库</a>
Passport is Express-compatible authentication middleware for Node.js.
扩展插件——策略
The API is simple: you provide Passport a request to authenticate, and Passport provides hooks for controlling what occurs when authentication succeeds or fails.
官网登录策略（不同方式登录）——http://www.passportjs.org/docs/
使用本地策略（用户名-密码）

**看文档！！！！！**
* Authenticate
* Configure
* Username & Password
* OpenID
session功能很强大
可以显示flash信息

# 19 使用 passport 实现登录功能 part 1
1. 增加策略——安装库+策略
2. 策略放置在配置文件config

判断用户名，密码两者时候匹配
序列化与反序列化

# 20 使用 passport 实现登录功能 part 2
使用策略——中间件
本地页面验证http://www.passportjs.org/docs/authenticate/

# 21 实现注销功能
http://www.passportjs.org/docs/logout/

# 22 文章与用户关联实现访问控制 part 1
文章作者默认为登录用户

登录之后才显示写文章的按钮，并且控制这个页面的访问（权限验证）
中间件函数来验证登陆后才可以跳转的路由

# 23 文章与用户关联实现访问控制 part 2
其他用户查看文章不显示delete、edit按钮，没有编辑删除的权限
