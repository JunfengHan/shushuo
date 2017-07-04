/**
 * 应用程序的启动（入口）文件
 * Created by Administrator on 2017/6/24.
 */

//加载express模块
var express = require('express');

//创建app应用 => NodeJs HTTP.creatServer();
var app = express();

//设置静态文件托管 =>当用户访问的url以/public开始，那么直接返回对应的__dirname + 'public'下的文件
app.use( '/public', express.static(__dirname + '/public'));
// app.use( express.static('/public'));

//加载模板处理模块
var swig = require('swig');
//配置应用模版 => 定义当前应用使用的模版引擎 =>parameter1:模版引擎名称，同时也是文件模版后缀 2：和app.engine中定义的模版引擎名称（第一个参数）要一致
app.engine('html', swig.renderFile);
//设置模板文件存放目录，paramater1:views, paramater2:目录
app.set('views', './views');
//注册所用的模版引擎，paramater1:view engine, 2:要和app.engine方法中定义的引擎的名称（paramater1）相同
app.set('view engine', 'html');
//开发过程中，先取消模版缓存
swig.setDefaults({cache:false});

//加载数据库模块
var mongoose = require('mongoose');

//加载中间件body-paser,加载解析json,用来处理post提交过来的数据
var bodyParser = require('body-parser');

//加载cookies模块
var Cookies = require('cookies');

//加载用户数据表
var User = require('./models/User');

//bodyparser设置
app.use( bodyParser.urlencoded({extended: true}) );

//设置cookie
app.use( function (req, res, next) {
   req.cookies = new Cookies(req, res);

   //解析登录用户的cookie信息,检验是否登录状态
    req.userInfo = {};
    if (req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch(e){
            next();
        }
    } else {
        next();
    }

});

//使用express框架绑定路由 -> 首页
/*app.get('/', function (req, res, next) {
    // res.send('<h1>欢迎光临han的博客！</h1>');

    //读取views目录下指定文件，解析并返回给客户端 =>paramater1:模版文件，相当于views目录，views/index.html
    //paramater2:传递给模版使用的数据
    res.render('index');
});*/

//根据不同的功能划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//连接数据库，监听http请求
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log('数据库连接错误');
    } else {
        console.log('数据库连接成功');
        app.listen(8081);
    }
});
