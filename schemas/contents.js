//内容的表结构

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

	//关联字段,内容分类的id
	category: {
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用
		ref: 'Category'
	},

	//分类标题
	title: 'string',

	//关联字段，用户的id
	user: {
		//类型
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	//添加时间
	addTime: {
		type: Date,
		default: Date.now
	},

	//阅读量
	views: {
		type: Number,
		default: 0
	},

	//简介
	description: {
		type: 'string',
		default: ''
	},
	//内容
	content: {
		type: 'string',
		default: ''
	},

	//评论
	comments: {
		type: Array,
		default: []
	}

});