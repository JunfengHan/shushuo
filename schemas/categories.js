/*添加分类的数据库结构*/

var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({
    //用户名
    name: String
    
});