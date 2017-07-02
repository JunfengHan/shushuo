/**
 * Created by Administrator on 2017/6/24.
 */

var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

router.get('/', function (req, res, next) {

	var data = {
		userInfo: req.userInfo,
		category: req.query.category || '',
		categories: [],

		count: 0,

		page: Number(req.query.page || 1),   
		limit: 10,
		pages: 0  
	}
	
	var where = {};
	if (data.category) {
		where.category = data.category
	}

	//读取分类信息
	Category.find().then(function(categories){
		
		data.categories = categories;

		return Content.where(where).count();

		//读取总内容数
	}).then(function(count){

		data.count = count;

		data.pages = Math.ceil(data.count / data.limit);
		data.page = Math.min( data.page, data.pages);
		data.page = Math.max( data.page, 1);

		var skip = (data.page -1)*data.limit;
		
		return Content.where(where).find().limit(data.limit).skip(skip).populate(['catagory','user']).sort({
			addTime: -1
		});

	}).then(function(contents){
		data.contents = contents;
		res.render('main/index',data);
	});
});

module.exports = router;