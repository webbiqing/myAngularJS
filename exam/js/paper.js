/**
* 试卷模块
* */
angular.module("paperModule",["ng","subjectModule"])
    .controller("paperAddCtrl",["$scope","getAllDataService","GetData",function ($scope,getAllDataService,GetData) {
        getAllDataService.getDepartData(function (data) {
            $scope.departement = data;
        });
        $scope.model=GetData.PaperData;
    }])
    .factory("GetData",function () {
        return {
            PaperData:{
                "name":"",
                "info":"",
                "depart":1,
                "time":120,
                "tt":0,
                "scores":0,
                "subject":[],
                "subjectIds":[]
            },
            AddSubjectId:function(id){
                this.PaperData.subject.push(id);
            },
            AddSubjectIds: function (subject) {
                this.PaperData.subjectIds.push(subject);
            } 
            // copyData:function () {
            //     console.log($scope.model);
            //     //console.log(angular.copy(data,copyData));
            // }
        }
    })


    .controller("paperListCtrl",["$scope",function ($scope) {

    }]);