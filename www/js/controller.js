/**
controller.js

Copyright (c) 2015 xylitol45

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
(function(){
    'use strict';
    
    angular.module("controllerModule", ['ngSanitize'])
    .controller('firstCtrl',['shared',function(shared){
        
        console.log(shared.uuid());
/*
var memo = MC.Collection("memo_collection");
memo.findOneMine(CRITERIA)
.then(function(item) {
  item.title = NEW_TITLE;
  return item.update();
}, function(err){
  console.log('Error: ' + JSON.stringify(err));
  return null; })
.then(function(updatedItem) {
  console.log('Updating is success!' + JSON.stringify(updatedItem));
});
*/
        monaca.cloud.User.autoLogin()
        .then(function(result){
            shared.userid = result._userid;
            app.navi.replacePage('top.html',{animation:"none"});
        },function(err){
            app.navi.replacePage('signup.html',{animation:"none"});
        });
    }])
    .controller('signupCtrl',['shared','$scope',function(shared,$scope){
        console.log('signupCtrl');
        var _this=this;
        _this.username = _this.password = '',
        _this.sample = '<span>hello</span>',
        _this.onSignup = function(){
            monaca.cloud.User.register(_this.username, _this.password)
            .done(function(result)
            {
                shared.userid = result.user._id;
                app.navi.replacePage('top.html',{animation:"none"});
            }
            )
            .fail(function(err)
            {
                ons.notification.alert({
                    title:'error',
                    message: err.message,
                    animation: 'none',
                });  
            });
        },
        _this.onGoLogin = function(){
            app.navi.replacePage('login.html',{animation:"none"});    
        };
        var _uuid = shared.uuid();
        
        
        shared.startup().then(
             function(res){ console.log(res); },
             function(res){ console.log(res); }
        );
        
        
    }])
    .controller('loginCtrl',['shared','$scope',function(shared,$scope){
        var _this=this;
        _this.username=_this.password='',
        _this.onLogin = function(){
            monaca.cloud.User.login(_this.username, _this.password)
            .done(function(result){
                shared.userid = result.user._id;
                app.navi.replacePage('top.html',{animation:"none"});
            })
            .fail(function(err)
            {
                ons.notification.alert({
                    title:'error',
                    message: err.message,
                    animation: 'none',
                });  
            });
        },
        _this.onGoSignup = function(){
            app.navi.replacePage('signup.html',{"animation":"none"});    
        };
    }])
    .controller('topCtrl',['shared','$scope',function(shared,$scope){
        var _this = this,
            _diary = monaca.cloud.Collection("idea"),
            _permission = {'public':'r'},
            _userid = null;

        _this.memo = 'ABC',
        _this.onRegister = function(){
            monaca.cloud.User.register("me@example.com", "password", {age:21})
            .done(function(result)
            {
                console.log("Welcome, " + result.user._username);
                console.log("You are " + result.user.age + " years old.");
                _userid = result.user._id;
            }
            )
            .fail(function(err)
            {
               console.log("Err#" + err.code +": " + err.message);
            });
/*
            monaca.cloud.User.validate("me@example.com")
            .done(function(result)
            {
                console.log("Validation passed!");
            })
            .fail(function(err)
            {
                console.log("Err#" + err.code +": " + err.message);
            });
*/
        },
        _this.onSave = function() {
            _userid = 'u144995e1-5941-4fff-8a25-eec91ac4570d';
            var _permission = {};
            _diary.insert({memo: _this.memo}, _permission)
            .done(function(result)
            {
               console.log("Inserted!");
            })
            .fail(function(err)
            {
               console.log("Err#" + err.code +": " + err.message);
            });
        };


        monaca.cloud.User.autoLogin()
        .done(function(result)
        {
            console.log("Hello again, " + result.user._username);
        })
        .fail(function(err)
        {
            console.log("Err#" + err.code +": " + err.message);
        });
    }])        
    .controller('top2Ctrl',['shared','$http', '$scope',function(shared,$http,$scope){
        
//        console.log('topCtrl');
        
        var _this=this;
        shared.loadBooks();

        _this.getBooks = function() {
//            console.log('getBooks');
            return shared.getBooks();    
        },
        _this.onBook = function(i) {
            shared.startQuestion(i);
            app.navi.pushPage('question.html');  
        },
        _this.onDeleteBook = function(i,e){
//console.log(i);
            e.stopPropagation();
            var _books = shared.getBooks(), 
                _book = _books[i];
            if (!_book) {
                return;
            }
            ons.notification.confirm({
                message: _book['title'] + 'を削除しますか？',
                // もしくは messageHTML: '<div>HTML形式のメッセージ</div>',
                title: '',
                buttonLabels: ['はい', 'いいえ'],
                animation: 'default', // もしくは'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                // -1: キャンセルされた
                // 0-: 左から0ではじまるボタン番号
                    if (index == 0) {
                        shared.removeBook(i);
                        shared.loadBooks();
                        $scope.$apply();
                    }
                }
            });            
        },
        _this.onMenu = function(){
            var _dlg = 'top_menu_dialog.html';
            ons.createDialog(_dlg).then(function(dialog) {
                dialog.show();
            });
        },
        _this.goQuestion = function(){
            app.navi.pushPage('question.html');  
        },
        _this.start = function(){
            shared.startQuestion();
            app.navi.pushPage('question.html');            
        };
    }])
    .controller('topMenuDialogCtrl',['shared',function(shared){
        var _this=this;
        _this.goHowto=function(){
            app.topMenuDialog.hide();
            app.navi.pushPage('howto.html');
        },
        _this.goLoadSample=function(){
            app.topMenuDialog.hide();
            app.navi.pushPage('load_sample.html');
        },
        _this.goLoadUrl=function(){
            app.topMenuDialog.hide();
            app.navi.pushPage('load_url.html');
        };
    }])    
    .controller('howtoCtrl',['shared','$http',function(shared,$http){
        var _this=this;
        $http.get('qa.txt',{
            params:{"t":(+new Date())},
            transformResponse:function(data){return data;}
        })
        .then(
            function(res){      
                _this.data = res.data;
            });                    
        
    }])
    .controller('loadSampleCtrl',['shared','$scope',function(shared,$scope){
        var _this=this;
        _this.onLoadSample=function(url){
            shared.addBook(url).then(
                function(){
                    shared.loadBooks();
                    app.navi.popPage();
                },
                function(){
                    console.log('failed');
                    ons.notification.alert({
                        title:'', message: '読み込みに失敗しました',
                    });
                }
            );    
        };
    }])        
    .controller('loadUrlCtrl',['shared','$scope',function(shared,$scope){
        var _this=this;
        _this.url='',
        _this.onLoad=function(){
            shared.addBook(_this.url).then(
                function(){
                    shared.loadBooks();
                    app.navi.popPage();
                },
                function(){
                    ons.notification.alert({
                        title:'', message: '読み込みに失敗しました',
                    });
                }
            );    
        };
    }])    
    .controller('questionCtrl',['shared','$http', function(shared,$http){
        var _this=this;
        _this.q = "",
        _this.title='',
        _this.total=0,
        _this.choices = shared.choices,
        _this.displayQuestion=function(){
            var _que = shared.getQuestionDetail();
            if (_que) {
                _this.index = _que.index;
                _this.total = _que.total;
                _this.title = _que.title;
                _this.q = (_que.q || '').replace(/\n/g,'<br>');
            }
        },
        _this.goQuestion = function(){
            app.navi.pushPage('question.html');  
        },
        _this.goAnswer = function(no){
            shared.setAnswer(no);
            ons.createDialog("answer_dialog.html").then(function(dlg) {                
                dlg.on('prehide',function(e){
                    _this.next();
                });
                dlg.show();
            });            
        },
        _this.goPass = function(){
            shared.setAnswer(0);
            _this.next();    
        },
        _this.next = function(){
            if (shared.nextQuestion()){
                _this.displayQuestion();
            } else {
                app.navi.replacePage('result.html');                
            };
        },
        _this.onExit = function(){
            ons.notification.confirm({
                message: '終了してもよろしいですか？',
                // もしくは messageHTML: '<div>HTML形式のメッセージ</div>',
                title: '',
                buttonLabels: ['はい', 'いいえ'],
                animation: 'default', // もしくは'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                // -1: キャンセルされた
                // 0-: 左から0ではじまるボタン番号
                    console.log(index);
                    if (index == 0) {
                        app.navi.replacePage('result.html');
                    }
                }
            });            
        },
        _this.show = function(dlg) {
            ons.createDialog(dlg).then(function(dialog) {
                dialog.show();
            });
        };
        _this.displayQuestion();        
    }])
    .controller('answerDialogCtrl',['shared',function(shared){
        var _this=this;
        _this.isCorrect = shared.isCorrect();
    }])
    .controller('questionMenuDialogCtrl',['shared',function(shared){
        var _this=this;
        _this.goFinish=function(){
            app.questionMenuDialog.hide();
            app.navi.replacePage('result.html');
        };
    }])
    .controller('resultCtrl', ['shared',function(shared){
        var _this=this;
        _this.correctTotal = shared.getCorrectTotal(),
        _this.total = shared.questions.length,
        _this.goTop = function(){
            app.navi.replacePage('top.html');    
        };

        shared.updateBookResult({
            'time' : (+ new Date()),
            'total': _this.total,
            'correctTotal':_this.correctTotal
        });            
    }]);
    
})();
