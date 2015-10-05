(function(){
    'use strict';
    
    angular.module("controllerModule", [])
    .controller('firstCtrl',['shared','$scope',function(shared,$scope){        
        var _this=this;
        _this.loading = true,
        _this.onStartup = function(){
            _this.loading = true;
            shared.startup().then(
                function(res){
                    // ログイン完了後に呼び出される    
                    app.navi.replacePage('top.html',{animation:"none"});
                },
                function(err){_this.loading=false;$scope.$apply();}
            );
        };
        _this.onStartup();
    }])
    .controller('topCtrl',['shared',function(shared){
        // TOP画面
        this.username = shared.username;
    }]);
    
})();
