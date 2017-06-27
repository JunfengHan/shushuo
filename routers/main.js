/**
 * Created by Administrator on 2017/6/24.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    console.log(req.userInfo);

    res.render('main/index',{
        userInfo: req.userInfo
    });
});

module.exports = router;