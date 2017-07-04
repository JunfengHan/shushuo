/**
 * Created by Administrator on 2017/6/24.
 */

var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

var data;

//处理各个路由相同的部分
router.use(function(req, res, next){

	data = {
		userInfo: req.userInfo,
		categories: []
	}
	//读取分类信息
	Category.find().then(function(categories) {
		data.categories = categories;
		next();
	});

})


router.get('/', function (req, res, next) {

	
	data.category = req.query.category || '';
	data.count = 0;
	data.page = Number(req.query.page || 1);   
	data.limit = 10;
	data.pages = 0;
		
	var where = {};
	if (data.category) {
		where.category = data.category
	}

	Content.where(where).count().then(function(count){

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


//查看文章内容
router.get('/view', function(req, res){

	var contentId = req.query.contentid || '';

	Content.findOne({
		_id: contentId
	}).then(function(content){

		data.content = content;

		content.views++
		content.save();

		res.render('main/main_content', data)
	});

});

module.exports = router;