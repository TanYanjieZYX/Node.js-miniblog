const express = require('express');   //引入express库
const path = require('path');  //引入路径库，处理路径
const mongoose = require('mongoose'); //导入mongoose库
const bodyParser = require('body-parser');  //解析post获得的数据
const session = require('express-session'); //引用session来实现flash功能
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);//connect方法连接数据库——后面有名字
let db = mongoose.connection;   //创建连接
//创建目录来放表collection——models/article.js

//创建连接来监听
//数据库成功后的提示
db.once('open', function() {
  console.log('Connected to Mongodb');
})
//数据库连接出错后的处理
db.on('error', function(err) {
  console.log(err);
});

const app = express();   //生成app实例
//session中间件 secret——秘钥
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}));
//flash实现的插件代码
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
//用户验证功能
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

let Article = require('./models/article'); //引入数据库存储的表

app.set('views', path.join(__dirname, 'views'));  //express认识模板引擎pug，放置在一个文件夹中，当前目录的views放模板
app.set('view engine', 'pug');
    
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    res.render('articles/index', {
      articles: articles
    });
  });
})

//监听端口
app.listen(5000, function() {
  console.log("Server started on port 5000.");
})