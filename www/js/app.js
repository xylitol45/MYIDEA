(function(){
    'use strict';

    ons.bootstrap("myApp",['onsen','controllerModule'])
    .factory('shared',[function(){     
        var _o = {
            userid:null,
            uuid:function(){
                var S4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
                }   
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
            },
            startup:function(){
                //monaca.cloud.User.logout();return;
                var _d = new $.Deferred;
                monaca.cloud.User.autoLogin()
                .then(
                    function(res){
                        _o.userid = res.user._id;
                        _d.resolve("OK");
                    },
                    function(){
                    // localStorageと紐づく
                        monaca.cloud.User.register(_o.uuid(),_o.uuid())
                        .then(
                            function(res){_o.userid=res.user._id; _d.resolve("OK");},
                            function(err){_d.reject(err);}
                        );
                        return;
                    }
                );
                return _d.promise();
            }
        };
        return _o;            
    }]);

})();
