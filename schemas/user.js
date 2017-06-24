//Created by Administrator on 2017/6/24.
//数据库的存储结构

var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    username: 'string',
    //密码
    password: 'string'
});