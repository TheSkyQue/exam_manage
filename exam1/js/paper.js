/**
 * Created by Administrator on 2016/9/28.
 * 试卷模块
 */
                    //模块，依赖核心模块，与app.subject模块
angular.module("app.paper",["ng","app.subject"])
                    //列表控制器(试卷查询控制器)
    .controller("paperListController",["$scope",function($scope){
    }])
                        //试卷添加控制器
    .controller("paperAddController",["$scope","commonService","paperModel","$routeParams","paperService",function($scope,commonService,paperModel,$routeParams,paperService){
                        //通过依赖的模块，和注入的依赖中的服务，调取该服务中的方法
        commonService.getAllDepartment(function (data) {
                        //将全部方向绑定到作用域的dps中
            $scope.dps = data
        });
        var subjectId = $routeParams.id;
        if(subjectId!=0){
                        //调用addSubject方法,将要添加的题目的id添加到数组中
            paperModel.addSubjectId(subjectId);
                        /*关于$routeParams唯一性
                        The service guarantees that the identity of the $routeParams object
                        服务保证$routeParams对象的唯一性
                        will remain unchanged (but its properties will likely change)
                        剩余将不会改变，（但是内容好像改变了）
                        even when a route change occurs.
                        甚至当一个route重现了。*/
                        //调用addSubject方法，调用angular中的copy方法创建$routeParams副本
            paperModel.addSubject(angular.copy($routeParams))
        }
                    //双向绑定的模板
                 //用服务创建的方法避免它重复加载覆盖
                //是同一个对象,直接用{}设置则是每次都创建一个新的对象
        $scope.pmodel = paperModel.model;
                    //设定savePaper方法
        $scope.savePaper = function(){
                    //调用服务中的savePaper方法
            paperService.savePaper($scope.pmodel,function(data){
                alert(data);
            })
        }
    }])
                //试卷删除控制器
    .controller("paperDelController",["$scope",function($scope){

    }])
    .factory("paperService",["$httpParamSerializer","$http",function($httpParamSerializer,$http){
        return{
            savePaper:function(param,handler){
                var obj = {};
                for(var key in param){
                    var val = param[key];
                    switch(key){
                        case"departmentId":
                            obj['paper.department.id'] = val;
                        case"title":
                            obj['paper.title'] = val;
                        case"desc":
                            obj['paper.description'] = val;
                        case"at":
                            obj['paper.answerQuestionTime'] = val;
                        case"total":
                            obj['paper.totalPoints'] = val;
                        case"scores":
                            obj['scores'] = val;
                        case"subjectIds":
                            obj['subjectIds'] = val;
                    }
                }
                //对obj对象进行表单格式序列化   $httpParamSerializer
                obj = $httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-type":"application/x-www-form-urlencoded"
                    }
                }).success(function(data){
                    handler(data);
                });
            }
        }
    }])
    .factory("paperModel",function(){
        return{
                    //模板  单例  一直保留
            model:{
                departmentId:1,          //方向
                title:"",                //试卷标题
                desc:"",                 //试卷描述
                at:0,                    //答题时间
                total:0,                //总分
                scores:[],             //每个题目的分值
                subjectIds:[],        //每个题的id
                subjects:[]
            },
                    //添加题目id的方法
            addSubjectId:function(id){
                    //将传入的id使用push方法添加到subjectIds这个数组中
            this.model.subjectIds.push(id);
            },
                    //添加题目的方法
            addSubject:function (subject) {
                //将传入的subject使用push方法添加到subjects这个数组中
                this.model.subjects.push(subject);
            }
        }
});

