const express = require('express');
const { check, validationResult } = require('express-validator/check');

let router = express.Router();

let Article = require('../models/article'); //引入数据库存储的表
let User = require('../models/user');
//定义路由,传递变量

//数组赋值到模板去
//名字的来由：find找的collection之前数据库创建的articles，Mongoose决定复数形式的collection名字
//Article——articles(数据库中collection的名字)
router.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
      res.render('articles/index', {
        articles: articles
      });//直接识别渲染index.pug文件的内容，传递变量，参数对象
    });
  })

router.get('/new', ensureAuthenticated, function(req, res) {
    res.render('articles/new', {
      title: 'Add Article'
    });
  })
  //id是动态参数，查询参数，查询字符串
router.get('/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
      //登录用户的id
      User.findById(article.author, function(err, user) {
        res.render('articles/show', {
          article: article,
          author: user.name //user的用户传入进去
        });
      });
    })
  })
  
  //修改文件的路由
router.get('/:id/edit', ensureAuthenticated, function(req, res) {
    Article.findById(req.params.id, function(err, article) {
      //验证用户是否有权限访问编辑
      if (article.author != req.user._id) {
        req.flash('danger', 'Not Authorized');
        return res.redirect('/');
      }  

      res.render('articles/edit', {
        title: 'Edit Article',
        article: article
      })
    })
  })
  
  //数据post
router.post('/create',  [
    check('title').isLength({ min: 1 }).withMessage('Title is required'),
    check('body').isLength({ min: 1 }).withMessage('Body is required')
  ], 
  function(req, res) {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.render('articles/new', {
        title: 'Add Article',
        errors: errors.array()
      })
    } else {
      let article = new Article(req.body);

      article.author = req.user._id ; //作者和登录用户的传递

      article.save(function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "Article Added");
          res.redirect('/')
        }
      })
    }
  })
  
  
router.post('/update/:id', function(req, res) {
    let query = { _id: req.params.id }
  
    Article.update(query, req.body, function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Article updated");
        res.redirect('/')
      }
    })
  })
  //删除文章的路由
  router.delete('/:id', function(req, res) {
    //验证用户删除权限
    if (!req.user._id) {
      return res.status(500).send();
    }
  
    let query = { _id: req.params.id };
    //删除本人的文章
    Article.findById(req.params.id, function(err, article) {
      if (article.author != req.user._id) {
        res.status(500).send();
      } else {
        Article.remove(query, function(err) {
          if (err) {
            console.log(err);
          }
  
          res.send('Success');
        })
      }
    })
  })
  
//中间件的函数——判断登陆还是没登陆
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/users/login');
    }
  }
  
module.exports = router;