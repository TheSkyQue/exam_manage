/**
 * Created by Administrator on 2016/9/22.
 * 题目管理的模块
 */


//angular  模块
angular.module("app.subject",["ng"])
    .controller("subjectDelController",["$routeParams","commonService","$location",function($routeParams,commonService,$location){
          //  alert(1);
        //删除题目
      var flag = confirm("确认删除吗?");
        if(flag){
            var id = $routeParams.id;
            console.log($routeParams.id);
            //调用删除数据的方法
            commonService.delSubject(id,function(data){
                alert(data);
                //页面发生跳转
                $location.path("/AllSubject/a/0/b/0/c/0/d/0")
            })
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0")
        }
    }])
    //审核题目
    .controller("subjectCheckController",["$routeParams","commonService","$location",function($routeParams,commonService,$location){
       commonService.checkSubjects($routeParams.id,$routeParams.state,function(data) {
            alert(data);
            //页面发生跳转
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        });
    }])
    .controller("subjectController",["$scope","$location","$routeParams","$http","commonService",function($scope,$location,$routeParams,$http,commonService) {
       //将路由绑定到作用域中
            $scope.params = $routeParams;
        //添加页面绑定的对象 ===>添加题目的页面的题目属性的选项
            $scope.subject = {
                typeId:1,       //默认显示第一个选项
                departmentId:1,
                levelId:1,
                topicId:1,
                stem:"",
                answer:"",//简答题的答案
                fx:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            //保存并提交
            $scope.submit = function(){
                commonService.saveSubject($scope.subject,function(data){
                    alert(data);
                });
                //重置作用域中表单的默认值
                var subject = {
                    typeId:1,       //默认显示第一个选项
                    departmentId:1,
                    levelId:1,
                    topicId:1,
                    stem:"",
                    answer:"",//简答题的答案
                    fx:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                angular.copy(subject,$scope.subject);
            };
        $scope.submitAddClose = function() {
            commonService.saveSubject($scope.subject, function (data) {
                alert(data);
            });
            //跳转与原来的页面
            $location.path("/AllSubject/a/0/b/0/c/0/d/0")
        };
        //获取数据
        //题目类型
        commonService.getAllType(function (data) {
           //console.log(data);
            $scope.types = data;
        });
        //题目方向
        commonService.getAllDepartment(function (data) {
            //console.log(data);
            $scope.departments = data;
        });
        //知识点
        commonService.getAllTopic(function (data) {
            //console.log(data);
            $scope.topics = data;
        });
        //题目难度
        commonService.getAllLevel(function (data) {
           // console.log(data);
            $scope.levels = data;
        });
        //获取所有题目信息
        commonService.getAllSubjects($routeParams,function (data) {
            //遍历出所有的信息
            data.forEach(function(subject){
                //这里的subject为形参,意为数据
                //console.log(subject.choices);
                var answer = [];
                //为每个选项添加编号  A B C D
                //遍历出题目的每一个选项获取索引
                subject.choices.forEach(function(choice,index){
                    //console.log(choice);
                    //console.log(index)
                    //定义一个值，调用能够将索引变为选项A，B的方法，传入参数索引，将结果赋予给他。
                    choice.no = commonService.convertIndexToNo(index);
                });
                //先判断题型如不是问答题
                //注意先判断是否为空，且必须放在前面，否则不起效果，因为会先执行前面的语句
                if( subject.subjectType!==null && subject.subjectType.id !==3){
                    //遍历出所有选项
                    subject.choices.forEach(function(choice){
                        //console.log(choice);
                        //如果choice.correct的结果为true
                        if(choice.correct){
                            //将上面所赋予给变的选项推入answer这个空数组中
                            answer.push(choice.no);
                            //console.log(answer);  从这里可以看出
                        }
                    })
                }
                //上面这个if语句是在遍历方法中所以过程也存在遍历。
                //修改当前题目的answer，将准备好的answer导出
                subject.answer = answer.toString();
            });
            $scope.subjects = data;
        })
    }])
    //创建服务
    .service("commonService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        //创建一个方法，参数为索引，通过三目运算符判断将索引依次变为选项 A B C D,返回其结果
        this.convertIndexToNo = function(index){
            return index==0?'A':(index==1?'B':(index==2?'C':(index==3?'D':'E')))
        };
        this.getAllType = function(handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
                handler(data);
            })
        };
        this.getAllDepartment = function(handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data){
                handler(data);
            })
        };
        this.getAllTopic = function(handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
                handler(data);
            })
        };
        this.getAllLevel = function(handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function(data){
                handler(data);
            })
        };
        //创建删除数据的方法
        this.delSubject = function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function(data){
                handler(data)
            });
        };
        //创建审核题目的方法
        this.checkSubjects = function(id,state,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
            }
            }).success(function(data){
                handler(data);
            });
        };
        //获取所有题目信息 =>为筛选做准备
        this.getAllSubjects = function(params,handler){
           // console.log(params);
            var data = {};
            //循环遍历将data转换为后台能够识别的筛选对象
            for(var key in params){
                //console.log(params);
                //console.log("循环遍历中的params"+params);
                console.log(key);
                var val = params[key];
                //只有当val不等于0的时候，才设置筛选属性
               if(val!=0){
                    switch(key){
                        case"a":
                            data['subject.subjectType.id']=val;
                            break;
                        case"b":
                            data['subject.department.id']=val;
                            break;
                        case"c":
                            data['subject.topic.id']=val;
                            break;
                        case"d":
                            data['subject.subjectLevel.id']=val;
                            break;
                    }
                }
            }
            console.log(data);
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:data
            }).success(function (data) {
                handler(data);
            });
        };
        //服务中保存并提交的方法
        this.saveSubject = function(params,handler){
            //处理数据
            var obj = {};
            //基层的for in 遍历方法
            for(var key in params){
                var val = params[key];
                switch(key){
                    case "typeId":
                        obj['subject.subjectType.id'] = val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id'] = val;
                        break;
                    case "departmentId":
                        obj['subject.department.id'] = val;
                        break;
                    case "topicId":
                        obj['subject.topic.id'] = val;
                        break;
                    case "stem":
                        obj['subject.stem'] = val;
                        break;
                    case "fx":
                        obj['subject.analysis'] = val;
                        break;
                    case "answer":
                        obj['subject.answer'] = val;
                        break;
                    case "choiceContent":
                        obj['choiceContent'] = val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect'] = val;
                        break;
                }
            }
                                //对obj对象进行表单格式序列化   $httpParamSerializer
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                                //响应头信息
                headers:{
                               //编码方式   ：默认方式
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            })
                .success(function (data) {
                    handler(data);
                   // alert("保存成功");
                });
        }
    }])
    //过滤     ==>通过所属方向过滤知识点
    .filter("selectTopic",function () {
        //input ==>要过滤的内容  id 方向id
        return function(input,id){
            //console.log(input,id);
            //
            if(input){
            var result = input.filter(function(item){
                return item.department.id == id;
            });
            //
            return result;
        }
        }
    })
    //指令
    .directive("selectOption",function(){
        return{
            //匹配属性
            restrict:"A",
            //链接阶段
            link:function(scope,element){
                console.log(element);
                element.on("change",function(){
                    var type = $(this).attr("type");
                    var val = $(this).val();
                    var isCheck = $(this).prop("checked");

                    //设置
                    if(type == "radio"){
                        //重置
                        scope.subject.choiceCorrect = [false,false,false,false];
                        for(var i=0;i<4;i++){
                        if(i==val){
                            scope.subject.choiceCorrect[i] = true
                        }
                    }
                    }else if(type =="checkbox") {
                        for (var i = 0; i < 4; i++) {
                            if (i == val) {
                                scope.subject.choiceCorrect[i] = true
                            }
                        }
                    }
                    //强制消化
                    scope.$digest();
                })
               // console.log(element);
               // console.log(scope.subject.choiceCorrect);
               // scope.subject.choiceCorrect.push(true);
               // console.log(scope.subject.choiceCorrect);
            }
           /* compile:function(){
                //编译
                return function link(){
                    //链接
                }
            },
            controller:function(){
                //控制
            }*/
        }
    })

    /*.service("subjectService",["$http",function(){
        this.grtAllSubject = function(handler){
            $http.get().success(function(data){
                handler(data);
            })
        }
    }])*/
   /* .factory("commonService",["$http",function ($http) {
        return{
            getAllTypes:function (handler) {
              $http.get("data/type.json").success(function(data){
                  handler(data);
              })
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
                   // handler(data);
               // })
            }
        }
    }])*/
    //provider的服务方法
   /* .provider("SubjectService",function(){
        this.url = "";
        this.setUrl =function(url){
            this.url = url;
        };
        this.$get = function($http) {
            var self = this;
            return {
                //
                getAllTopic : function(handler){
                $http.get(self.url).success(function(data){
                    handler(data);
                })
            },
                getAllLevel: function (handler) {
                    $http.get(self.url).success(function (data) {
                        handler(data);
                    })
                }
            }
        }
    })
    .config(function($routeProvider,SubjectServiceProvider) {
        var  address =["data/type.json","data/department.json","data/topics.json","data/level.json"];
        console.log(address[0]);
        SubjectServiceProvider.setUrl(address[0]);
        $routeProvider.when("", {
            templateUrl: "",
            controller: ""
        });
    })*/



