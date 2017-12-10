'use strict';

angular.module('Setting')

.controller('SettingController',
['$scope','$http','$routeParams','$rootScope',
function ($scope,$http,$routeParams,$rootScope) {
  $scope.user;

console.log($rootScope.globals.currentUser.email);
var openRequest = indexedDB.open("newsBlogDB");


openRequest.onsuccess = function(e) {
    console.log("Success!");
    var db = e.target.result;
    var transaction = db.transaction(["newsBlogDB"],"readwrite");
    var store = transaction.objectStore("newsBlogDB");
    var index = store.index("email");
    var request = index.get($rootScope.globals.currentUser.email);

request.onsuccess = function(e) {
    var result = e.target.result;
    $scope.$apply(function () {
            $scope.user = result;
        });
}
}

openRequest.onerror = function(e) {
    console.log("Error");
    console.dir(e);
}



$scope.update = function() {

  var openRequest = indexedDB.open("newsBlogDB");


  openRequest.onsuccess = function(e) {
      console.log("Success!");
      var db = e.target.result;
      var transaction = db.transaction(["newsBlogDB"],"readwrite");
      var store = transaction.objectStore("newsBlogDB");
      var index = store.index("email");
      var request = index.get($rootScope.globals.currentUser.email);

  request.onsuccess = function(e) {
      var result = e.target.result;
      $scope.user.name = $scope.name;
      $scope.user.password = $scope.password;
      $rootScope.globals.currentUser.name = $scope.name;
      store.put($scope.user);
      $scope.$apply(function () {
              $scope.user;
          });
           window.history.back();
  }
  }

  openRequest.onerror = function(e) {
      console.log("Error");
      console.dir(e);
  }

}
}]);
