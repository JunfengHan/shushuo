/**
 * Created by Administrator on 2017/6/24.
 */

$(function () {
   var $login = $('.login');
   var $signin = $('.signin');
   var $user = $('.user');

   //切换注册
    $login.find('.login_trigger').on('click', function () {
        $login.hide();
        $signin.show();
    });

    //切换到登陆面板
    $signin.find('.signin_trigger').on('click', function () {
        $signin.hide();
        $login.show();
    });

    //注册
    $signin.find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $signin.find('[name="username"]').val(),
                password: $signin.find('[name="password"]').val(),
                repassword: $signin.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (result) {
                // console.log(result);
                $signin.find('.colWarning').html(result.message);

                if ( !result.code ) {
                    //注册成功
                    setTimeout(function () {
                        $signin.hide();
                        $login.show();
                    },1000);
                }
            }
        });
    });

    //登录
    $login.find('button').on('click', function () {
        //通过ajax提交
        $.post("/api/user/login", {
            username: $login.find('[name="username"]').val(),
            password: $login.find('[name="password"]').val()
        }, function (data) {
            if ( !data.code ) {
                //登录成功,重新加载页面
                window.location.reload();

                /*setTimeout(function () {
                    $login.hide();
                    $user.show();
                    //显示登录用户的信息
                    $user.find('.user_name').html(data.userInfo.username);
                    $user.find('.self_introduce').html('我是传奇，未来是你的');

                },1000);*/
            }
        });
    });

    //退出
    $('#logout').on('click', function () {
        $.get('/api/user/logout', function (data) {
            if (!data.code) {
                window.location.reload();
            }
        })
    })
});