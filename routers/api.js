/**
 * 与后台交互有关的
 */

var express = require('express');
var router = express.Router();
//->返回一个构造函数，可以像操作对象一样操作数据库
var User = require('../models/User');
var Content = require('../models/Content');

//统一返回数据的格式
var responseData;

router.use( function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

//用户注册
router.post('/user/register', function (req, res, next) {
    // http://localhost:8081
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //验证用户输入是否合法
    if ( username == '' ) {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if ( password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if ( password != repassword ) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    //验证用户名是否已被注册，从数据库查询
    User.findOne({
       username: username
        //返回promise对象
    }).then(function ( userInfo ) {

        if ( userInfo ) {
            //数据库中已经注册了
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        var user= new User({
            username : username,
            password: password
        });
        return user.save();
    }).then(function( newUserInfo ) {
        responseData.message = '注册成功';
        res.json(responseData);
    });

});

//用户登录
router.post('/user/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if ( username == '' || password == '' ) {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }

    //查询数据库中用户名和密码是否匹配
    User.findOne({
        username: username,
        password: password
    }).then(function ( userInfo ) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码正确
        responseData.message  =  '登陆成功';
        //返回给前端的用户信息
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        //返回cookies,记录登录状态
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));

        res.json(responseData);
        return;
    })
});

//退出
router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});


//评论提交
router.post('/comment/post', function(req, res){
    //内容的id，评论在内容里
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    }
    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);
    });

});

//加载评论
router.get('/comment', function(req, res){

    var contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content){
        responseData.data = content.comments;
        res.json(responseData);
    });
});

module.exports = router;