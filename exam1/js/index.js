/**
 * Created by Administrator on 2016/9/22.
 * 首页核心js文件
 */
//jquery代码
$(function(){
    //左侧动画效果
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        $(".baseUI>li>ul").slideUp();
        //console.log(this);
     $(this).next().slideDown(300);
    });
    //点击变色
    $(".baseUI>li>ul>li").off("click");
    $(".baseUI>li>ul>li").on("click",function(){
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul>li").removeClass("current");
            //console.log(this);
            $(this).addClass("current");
        }
    })

    //默认收起全部，并展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
});
//
//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    //核心控制器
    .controller("mainCtrl",["$scope",function($scope){
    }])
    //路由配置
    .config(["$routeProvider",function($routeProvider){
        /*
        *a  类型id
        *b  方向id
        *c  知识点id
        * d  难度id
        * */
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/addTopic",{
            templateUrl:"tpl/subject/addTopic.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/paperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/paperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/paperSubjectList",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        });
    }]);