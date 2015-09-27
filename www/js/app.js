/**
app.js

Copyright (c) 2015 xylitol45

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
(function(){
    'use strict';

    ons.bootstrap("myApp",['onsen','controllerModule'])
    .factory('shared',['$http','$q',function($http,$q){
        console.log('first');        
        var _o = {
            userid:null,
            deviceId:null,
            alert:function(message) {
                
            },
            uuid:function(){
                var S4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
                }   
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
            },
            // savePropertiesのキーとなる端末IDはプラグインMonacaのgetRuntimeConfigurationより取得するので、実際にどういう値をとるかは不明。
            autoLoginByProperty:function(d){
                monaca.cloud.Device.getProperties(["username","password"])
                .then(
                    function(res){
                        var _username,_password;
                        if (res !== void 0 && res.username != void 0 && res.password != void 0) {
                            _username = res.username, _password = res.password;
                            monaca.cloud.User.login(_username, _password)
                            .then(
                                function(){d.resolve("OK");},
                                function(err){d.reject(err);}
                            );
                            return;
                        }
                        _username = _o.uuid(), _password = _o.uuid();
                        monaca.cloud.Device.saveProperties({'username':_username,"password":_password})
                        .then(function(){
                            return monaca.cloud.User.register(_username,_password);
                        })
                        .then(
                            function(){d.resolve('OK');},
                            function(err){d.reject(err);}
                        );
                    },
                    function(err){ d.reject(err); }
                );
                return;
            },
            startup:function(){
                //monaca.cloud.User.logout();return;
                var _d = new $.Deferred;
                monaca.cloud.User.autoLogin()
                .then(function(res){
                    _o.userid = result.user._id;
                    _d.resolve('OK');
                },
                function(){
//                    _o.autoLoginByProperty(_d);
                    // localStorageと紐づく
                    monaca.cloud.User.register(_o.uuid(),_o.uuid())
                    .then(
                        function(res){_o.userid=res.user._id; _d.resolve('OK');},
                        function(err){_d.reject(err);}
                    );
                    return;
                });
                return _d.promise();
            }
        };

        ons.ready(function() {
                monaca.getDeviceId(function(id){
                    //_o.uuid = id;
                    _o.deviceId = id;
//                    console.log("id:"+id);
                });
            });
        return _o;            
    }]);
    
})();
