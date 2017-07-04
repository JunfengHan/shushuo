var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];

//提交评论
$('#comment_btn').on('click', function(){
	$.post('/api/comment/post', {
		contentid: $('.contentId').val(),
		content: $('#message_comment').val()
	}, function(responseData){
		$('#message_comment').val('');
		comments = responseData.data.comments;
		renderComment(comments);
	});
});

//每次页面重载的时候获取一下该文章的所有评论
$.get('/api/comment',{
	contentid: $('.contentId').val()
}, function(responseData){
	comments = responseData.data.reverse();
	renderComment();
});

//分页
$('.pager').on('click','a', function(){

	if($(this).parent().hasClass('previous')){
		page--;
	} else {
		page++;
	}
	renderComment();
})

//将返回的数据插入前端页面
function renderComment(){

	$('.comment_num').html(comments.length);

	pages = Math.max(Math.ceil(comments.length / prepage), 1);
	var start = Math.max(0, (page-1)*prepage);
	var end = Math.min(start + prepage, comments.length);

	var $lis = $('.pager li');
	$lis.eq(1).html( page + '/' + pages);

	if (page <= 1) {
		page = 1;
		$lis.eq(0).html('<span>没有上一页了</span>');
	} else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }

    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if (comments.length == 0) {
        $('.comment_notice').show();
    } else {
		var html = '';
		for(var i=start; i<end; i++){
			html += '<li class="comment_content_list">'
						+'<div class="commnet_user">'
							+'<img src="">'
		                    +'<p class="comment_username">'+ comments[i].username +'</p>'
		                    +'<p class="comment_time">'+ formatDate(comments[i].postTime) +'</p>'
	               		+'</div>'
	                +'<div class="comment_content">'+ comments[i].content +'</div>'
	            +'</li>'
		}
		$('.comment_list').html(html);
	}
}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日 ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}