let mongoose = require('mongoose');  //引入进来

let articleSchema = mongoose.Schema({
  //数据类型，定义collection的结果json
    title: {
    type: String,
    required: true //必须填入
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema); //模块导出
