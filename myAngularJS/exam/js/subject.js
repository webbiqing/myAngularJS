/**
 * Created by wbqing on 2016/9/22.
 * 题库模块
 * 使用了三种不同的自定义服务来获取数据
 */angular.module("subjectModule",["ng"])
    //删除题目的控制器
    .controller("subjectDelCtrl",["$scope","$routeParams","getALLSubjectService","$location",
    function ($scope,$routeParams,getALLSubjectService,$location) {
        if(confirm("确定删除数据？")){
            getALLSubjectService.DelData(function (data) {
                alert(data);
            },$routeParams.id);
        }
        $location.path("/SubjectList/dpId/0/typeId/0/topicId/0/levelId/0");
    }])
     //定义审核控制器
    .controller("subjectCheckCtrl",["$scope","$routeParams","getALLSubjectService","$location",
        function ($scope,$routeParams,getALLSubjectService,$location) {
            //调用审核函数
            getALLSubjectService.Checked(function (data) {
                alert(data);
            },$routeParams.CheckId,$routeParams.CheckState);
            $location.path("/SubjectList/dpId/0/typeId/0/topicId/0/levelId/0");
        }])
    //页面增查控制器
    .controller("subjectCtrl",["$scope","getALLSubjectService","getAllDataService","$filter","$routeParams","$location",
    function ($scope,getALLSubjectService,getAllDataService,$filter,$routeParams,$location) {
        //默认选中有答案
        $scope.flag = true;
        $scope.params = $routeParams;
        //将筛选所需要传送的数据取到
         var getParams = (function () {
             var obj = {};
             if($scope.params.typeId != 0){
                 obj['subject.subjectType.id'] = $scope.params.typeId;
             }
             if($scope.params.topicId != 0){
                 obj['subject.topic.id'] = $scope.params.topicId;
             }
             if($scope.params.levelId != 0){
                 obj['subject.subjectLevel.id'] = $scope.params.levelId;
             }
             if($scope.params.dpId != 0){
                 obj['subject.department.id'] = $scope.params.dpId;
             }
             return obj;
         })();
         //获取到所有的Type的数据
        getAllDataService.getTypeData( function (data) {
            $scope.Type = data;
        });
         //获取到难度的数据
        getAllDataService.getLevelData(function (data) {
            $scope.Level = data;
        });
         //获取到方向的数据
        getAllDataService.getDepartData(function (data) {
            $scope.departement = data;
        });
         //获取到知识点的数据
        getAllDataService.getTopicsData(function (data) {
             $scope.Topics = data;
        });
        //获取到所有的subjects
        getALLSubjectService.getALLsubjects(function (data) {
            //遍历所有的题目，将所有的正确答案赋予给answer
            data.forEach(function (item) {
                //判断题型
                if(item.subjectType&&item.subjectType.id !=3){
                    //使用数组去接收
                    var result = [];
                    //根据判断的题型去遍历到choices
                    item.choices.forEach(function (item,index) {
                        //将索引值跟字母选项进行置换
                        if(item.correct){
                            var answer = $filter("indexToNu")(index);
                            result.push(answer);
                        }
                    });
                    //将答案传给item.answer
                    item.answer = result.toString();
                }
            });
            $scope.Subjects = data;
        },getParams);
        //调用自定义的添加题目的自定义服务中的函数
        $scope.saveDataAgain = function () {
            getALLSubjectService.saveAddData(function (data) {
                alert(data);
            },$scope.addObj);
            var addObj = {
                "subject.subjectType.id":0,
                "subject.subjectLevel.id":0,
                "subject.topic.id":0,
                "subject.department.id":0,
                "subject.stem":"",
                "subject.answer":"",
                "subject.analysis":"",
                "choiceContent":[],
                "choiceCorrect":[false,false,false,false]
            };
            angular.copy(addObj,$scope.addObj);
        };
        //添加并退出
        $scope.saveDataEdit = function () {
            getALLSubjectService.saveAddData(function (data) {
                alert("保存成功！");
                $location.path("/SubjectList/dpId/0/typeId/0/topicId/0/levelId/0");
            },addObj);
        }
        //定义添加题目页面的id，同时对四种种类的id进行保存
        $scope.addObj = {
            "subject.subjectType.id":0,
            "subject.subjectLevel.id":0,
            "subject.topic.id":0,
            "subject.department.id":0,
            "subject.stem":"",
            "subject.answer":"",
            "subject.analysis":"",
            "choiceContent":[],
            "choiceCorrect":[false,false,false,false]
        };
        var addObj = (function () {
            return $scope.addObj;
        })();
        //定义changeClear()函数，每次改变的时候清空之前对用户可能有影响的的数据
        $scope.changeClear = function () {
            addObj.choiceCorrect = [false,false,false,false];
            addObj['subject.answer'] = "";
        }
}])
    //题目服务，封装操作题目的函数
    .service("getALLSubjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        //定义审核函数
        this.Checked = function (handler,id,state) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params :{
                    "subject.id":id,
                    "subject.checkState": state
                }
            }).success(function (data) {
                handler(data);
            });
        }
        //定义删除题目的函数
        this.DelData = function (handler,params) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    "subject.id":params
                }
            }).success(function (data){
                handler(data);
            });
        };
        this.getALLsubjects = function(handler,params){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action", {
                params : params
            }).success(function (data) {
                    handler(data);
            });
        };
        this.saveAddData = function (handler,params) {
            //将传进来的参数转化成表单的形式
            params = $httpParamSerializer(params);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",params,{
                headers:{
                    //定义表单请求头
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            });
        };
    }])
    //使用自定义服务中工厂函数的模式进行对获取数据函数的定义
    .factory("getAllDataService",["$http",function ($http) {
        return {
            //获取到所有类型的数据
            getTypeData:function (handler) {
                //$http.get("data/types.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    handler(data);
                });
            },
            //定义获取到难度的数据函数
            getLevelData:function (handler) {
                //请求数据的地址
                //$http.get("data/levels.json").success(function (data) {
                 $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    handler(data);
                });
            },
            getDepartData:function (hanlder) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                //$http.get("data/departmentes.json").success(function (data) {
                    hanlder(data);
                });
            },
            getTopicsData : function (hanlder) {
                //$http.get("data/topics.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                    hanlder(data);
                });
            }
        }
}])
    //定义添加页面里面的过滤器对方向和知识点进行筛选,通过双向数据绑定的数据来进行筛选
    .filter("addFilter",function () {
        return function (input,id) {
            //通过传进来的数组再对数组进行遍历
            if(input){
                var obj = input.filter(function (item) {
                   return item.department.id == id;
                });
            }
            return obj;
        }
    })
    //使用过滤器对答案进行编写
    .filter("indexToNu",function () {
        return function (input) {
            return input==0?'A':(input==1?'B':(input==2?'C':'D'));
        }
    })
    //定义指令来设置单选以及多选的选项值
    .directive("getOptions",function(){
        return {
            restrict: "AE",
            //给option绑定change事件
            link: function(scope, element){
                element.off("change");
                element.on("change",function () {
                    if(element.attr("type")=="radio"){
                        //通过val的值来确定正确答案，在选择前进行重置操作
                        scope.addObj.choiceCorrect = [false, false, false, false];
                        scope.addObj.choiceCorrect[angular.element(this).val()] = true;
                    }else if(element.attr("type")=="checkbox"){
                        if(angular.element(this).prop("checked")){
                            scope.addObj.choiceCorrect[angular.element(this).val()] = true;
                        }
                        scope.addObj.choiceCorrect[angular.element(this).val()] = false;
                    }
                    scope.$digest();
                });
            }
        }
    });

