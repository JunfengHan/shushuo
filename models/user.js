/**
 * Created by Administrator on 2017/6/24.
 */

//数据的增删改查是直接操作模型类的，不是操作数据库结构（schemas）
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User', usersSchema);