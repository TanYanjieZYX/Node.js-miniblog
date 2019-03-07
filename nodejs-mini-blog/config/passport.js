const LocalStrategy = require('passport-local').Strategy;//引入本地策略的库
const User = require('../models/user');
const bcrypt = require('bcrypt');

//导出成为一个函数
module.exports = function(passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        //用户没找到
        if (!user) { return done(null, false, { message: 'No User Found' }); }
        //匹配密码，提交的密码加密之后与数据库中的进行比较
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) { return done(err); }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        })

      });
    }
  ));
 //序列化与反序列化
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
