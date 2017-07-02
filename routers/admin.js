/**
 * Created by Administrator on 2017/6/24.
 */

var express = require('express');
var router = express.Router();

//加载数据表
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req, res, next){
	if(!req.userInfo.isAdmin) {
		//如果不是管理员
		res.end(" 对不起，只有管理员才可以进入管理页面！");
		return;
	}
	next();
});


//后台首页
router.get('/',  function(req, res, next){
	res.render('admin/index', {
		userInfo: req.userInfo
	});
});


//用户管理
router.get('/user', function(req, res){

	//从数据库读取用户

	var page = Number(req.query.page || 1);   //第几页
	var limit = 10;  //每页显示的数据个数
	var pages = 0;   //总页数

	//数据总条数
	User.count().then(function(count){

		//计算总页数,设置最大/最小值
		pages = Math.ceil(count / limit);
		page = Math.min(page, pages);
		page = Math.max(page, 1);

		var skip = (page - 1)*limit;  //忽略本页之前的数据

		User.find().limit(limit).skip(skip).then(function(users){
			res.render('admin/user_index',{
				userInfo: req.userInfo,
				users: users,

				page: page,
				pages: pages
			});
		});
	});
});


//分类的首页
router.get('/category/index', function(req, res) {
	/*res.render('admin/category_index', {
		userInfo: req.userInfo
	});*/

	//从数据库读取用户

	var page = Number(req.query.page || 1);   //第几页
	var limit = 10;  //每页显示的数据个数
	var pages = 0;   //总页数

	//数据总条数
	Category.count().then(function(count){

		//计算总页数,设置最大/最小值
		pages = Math.ceil(count / limit);
		page = Math.min(page, pages);
		page = Math.max(page, 1);

		var skip = (page - 1)*limit;  //忽略本页之前的数据


		//sort()->排序
		Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories){
			res.render('admin/Category_index',{
				userInfo: req.userInfo,
				categories: categories,

				page: page,
				pages: pages
			});
		});
	});
});

//添加分类
router.get('/category/add', function (req, res) {
	res.render('admin/category_add', {
		// userInfo: req.userInfo
	});
});

//分类提交保存
router.post('/category/add', function(req, res){

	var name = req.body.name1 || '';

	if (name == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '名称不能为空'
		});
		return;
	}

	//检查数据库中是否存在相同名称
	Category.findOne({
		name: name
	}).then(function (rs) {
		if (rs) {
			//数据库中已经存在该分类
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类已经存在了'
			})
		} else {
			return new Category({
				name: name
			}).save();
		}
    }).then(function (newCategory) {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '分类保存成功',
			url: '/admin/category/index'
		});
    });
});


//分类修改
router.get('/category/edit', function(req, res){
	//获取要修改的分类的信息，以表单形式展示出来
	var id = req.query.id || '';

	//获取要修改的分类信息
	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			res.render('admin/category_edit', {
				userInfo: req.userInfo,
				category: category
			});
		}
	});
});


//分类修改保存
router.post('/category/edit', function(req, res){

	//获取要修改的分类的信息，以表单形式展示出来
	var id = req.query.id || '';
	console.log(id);
	//获取post提交过来的新的名称
	var name = req.body.name1 || '';
	console.log(typeof name);
	//获取要修改的分类信息
	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			//当用户没有任何的修改就提交
			if (name == category.name) {
				res.render('admin/success', {
					userInfo: req.userInfo,
					message: '修改成功',
					url: '/admin/category/index'
				});
				return Promise.reject();
			} else {
				//判断分类信息是否已经存在
				Category.findOne({
					//-->id不同name相同就算相同
					_id: {$ne: id}, 
					name: name
				});
			}
		}
	}).then(function(sameCategory){
		if (sameCategory){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '数据库中已经存在同名分类'
			});
			return Promise.reject();
		} else {
			return Category.update({
				_id: id
			}, {
				name: name
			});
		}
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '修改成功',
			url: '/admin/category/index'
		});
	});

});


//分类删除
router.get('/category/delete', function(req, res){

	//获取要删除的分类id
	var id = req.query.id || '';

	Category.remove({
		_id: id
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '删除成功',
			url: '/admin/category/index'
		});
	});
});

/*************后台内容管理*******************/

//后台内容列表
router.get('/content/index', function(req, res){

	var page = Number(req.query.page || 1);   //第几页
	var limit = 10;  //每页显示的数据个数
	var pages = 0;   //总页数

	//数据总条数
	Content.count().then(function(count){

		//计算总页数,设置最大/最小值
		pages = Math.ceil(count / limit);
		page = Math.min(page, pages);
		page = Math.max(page, 1);

		var skip = (page - 1)*limit;  //忽略本页之前的数据


		//sort()->排序
		Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category', 'user']).then(function(contents){
			res.render('admin/content_index',{
				userInfo: req.userInfo,
				contents: contents,

				page: page,
				pages: pages
			});
		});
	});

});


//后台添加内容
router.get('/content/add', function(req, res){

	Category.find().sort({_id: -1}).then(function(categories){
		res.render('admin/content_add', {
			userInfo: req.userInfo,
			categories: categories
		});
	});
});


//后台添加内容的保存
router.post('/content/add', function(req, res){

	console.log(req.body);
	//相关的提交验证
	if ( req.body.category == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容分类不能为空'
		});
		return;
	}

	if ( req.body.title == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容标题不能为空'
		})
		return;
	} 

	//保存数据到数据库
	new Content({
		category: req.body.category,
		title: req.body.title,
		user: req.userInfo._id.toString(),
		description: req.body.description,
		content: req.body.content
	}).save().then(function(rs){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content/index'
		});
	});

});


//内容的修改
router.get('/content/edit', function(req, res) {

	var id = req.query.id || '';

	var categories = [];

	Category.find().sort({_id: -1}).then(function(rs){

		categories = rs;

		return Content.findOne({
				_id: id
			}).populate('category');
	}).then(function(content){

		if (!content) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '指定内容不存在'
			});
			return Promise.reject();
		} else {
			res.render('admin/content_edit', {
				userInfo: req.userInfo,
				categories: categories,
				content: content
			});
		}
	});

});


//保存修改的内容
router.post('/content/edit', function(req, res){

	var id = req.query.id || '';

	//相关的提交验证
	if ( req.body.category == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容分类不能为空'
		});
		return;
	}

	if ( req.body.title == ''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容标题不能为空'
		});
		return;
	} 

	Content.update({
		_id : id
	}, {
		category: req.body.category,
		title: req.body.title,
		description: req.body.description,
		content: req.body.content
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content/index'
		});
	});

});


//内容的删除
router.get('/content/delete', function(req, res){

	var id = req.query.id || '';

	Content.remove({
		_id: id
	}).then(function(){
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '删除成功',
			url: '/admin/content/index'
		});
	});

});

module.exports = router;


