/***
*项目核心JS
 ***/
//左侧导航动画
$(function () {
    //收缩导航
    $(".baseUI>li>ul").slideUp("fast");
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp("fast");
        $(this).next().slideDown();
    });
    //默认点击
    $(".baseUI>li>a").eq(0).trigger("click");
    $(".baseUI ul>li a").off("click");
    $(".baseUI ul>li a").on("click",function () {
        if(!$(this).hasClass("current")){
            $(".baseUI ul>li").removeClass("current");
            $(this).parent("li").addClass("current");
        }
    });
    //默认点击第一个li中的a
    $(".baseUI ul>li").eq(0).find("a").trigger("click");
});


angular.module("app",["ng","ngRoute","subjectModule","paperModule"]).controller("indexCtrl",["$scope",function ($scope) {

}]).config(["$routeProvider",function ($routeProvider) {
    //通过路由的路径来进行判断以及筛选
    $routeProvider.when("/SubjectList/dpId/:dpId/typeId/:typeId/topicId/:topicId/levelId/:levelId",{
        templateUrl:"tpl/subject/SubjectList.html",
        controller:"subjectCtrl"
    }).when("/SubjectList/SubjectAdd",{
        templateUrl:"tpl/subject/SubjectAdd.html",
        controller:"subjectCtrl"
    }).when("/SubjectList/SubjectDel/DelId/:id",{
        templateUrl:"tpl/subject/SubjectList.html",
        controller:"subjectDelCtrl"
    }).when("/SubjectList/SubjectCheck/CheckId/:CheckId/CheckState/:CheckState",{
        templateUrl:"tpl/subject/SubjectList.html",
        controller:"subjectCheckCtrl"
    }).when("/PaperList",{
        templateUrl:"tpl/paper/paperManager.html",
        controller:"paperListCtrl"
    }).when("/paperAdd",{
        templateUrl:"tpl/paper/paperAdd.html",
        controller:"paperAddCtrl"
    }).when("/paperAdd/subjectList",{
        templateUrl:"tpl/paper/subjectList.html",
        controller:"subjectCtrl"
    }).when("/paperAdd/subjectList/:subjectId",{
        templateUrl:"tpl/paper/subjectList.html",
        controller:"subjectCtrl"
    });
}]);