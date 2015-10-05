(function(){
    'use strict';

    ons.bootstrap("myApp",['onsen','controllerModule'])
    .factory('shared',[function(){     
        var _o = {
            userid:null,
            username:null,
            uuid:function(){
                var S4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
                }   
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
            },
            startup:function(){
                var _d = new $.Deferred,
                _username = localStorage["username"], _password=localStorage["password"];
                if (_username !== void 0 && _password !== void 0) {
                    // ログイン
                    monaca.cloud.User.login(_username, _password).then(
                        function(res){
                            _o.userid = res.user._id,
                            _o.username = _username;
                            _d.resolve("OK");
                        },
                        function(err){_d.reject(err);}
                    );
                } else {
                    // ユーザ登録
                    // 既に登録済みusernameの場合、エラーになります
                    _username = _o.uuid().substr(0,8),
                    _password = _o.uuid();
                    monaca.cloud.User.register(_username, _password).then(
                        function(res){
                            localStorage["username"] = _username;
                            localStorage["password"] = _password;
                            _o.userid = res.user._id,
                            _o.username = _username
                            _d.resolve("OK");
                        },
                        function(err){_d.reject(err);}
                    );
                }
                return _d.promise();
            }
        };
        return _o;            
    }]);

})();
