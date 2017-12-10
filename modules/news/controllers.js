'use strict';

angular.module('News')

.controller('NewsController',
    ['$scope','$http','$routeParams','$rootScope',
    function ($scope,$http,$routeParams,$rootScope) {
 $scope.id = $routeParams.id;
 $scope.comment = function() {
    if (!$("#comment").val()) {
      alert("Fill the blank");
    }else {
        var transaction = $rootScope.db.transaction(["comments"], "readwrite");

        // report on the success of the transaction completing, when everything is done
        transaction.oncomplete = function(event) {
          console.log('Transaction completed');
        };

        transaction.onerror = function(event) {
          console.log('Transaction not opened due to error. Duplicate items not allowed');
        };


           var store = transaction.objectStore("comments");
           console.dir(store);
           //Define a person
           $scope.comment = {
               post_id: $scope.id,
               email:$rootScope.globals.currentUser.email,
               body:$("#comment").val()
           }

           //Perform the add
           var request = store.add($scope.comment);

           store.openCursor().onsuccess = function(e) {
       var cursor = e.target.result;
       if(cursor) {
           for(var field in cursor.value) {
               console.log(field+"="+cursor.value[field]+"<br/>");
           }
           cursor.continue();
       }
   }
     alert("Your comment " + $("#comment").val() + " Saved");
     window.history.back();
    }


 }
//  GET request :
$http({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/posts/' + $scope.id
}).then(function successCallback(response) {
$scope.news = response.data;
  console.log($scope.news );
  });
  //  GET request :
$http({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/posts/' + $scope.id + '/comments'
}).then(function successCallback(response) {
$scope.comments = response.data;
  });
}])
.directive('news', function() {
  return {
    template: "<div><div class=' col-sm-12 col-md-12 col-lg-12'><p class='demo-title'></p><div class=''><div class='thumbnail'><img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg'><div class='date'>"+
    '<div>27</div><div>Mar</div></div></div><div class="content" ><div class="category">News</div><h1 class="title">{{news.title}}</h1>'+
    '<p class="description">{{news.body}} </p>'+
    '<h3 >Comments</h3><hr><div  comments></div></div></div></div>'
  };
})
.directive('comments', function() {
  return {
    template: '<div  ng-repeat="x in comments" style="background: whitesmoke;padding: 10px;"><h4 >{{x.name}}</h4><h5>{{x.email}}</h5><p class="description">{{x.body}} </p></div><h3>New Comment</h3><hr><div style="margin-bottom: 100px;"><textarea rows="5" cols="100" id="comment"></textarea><button class="btn" style="font-size: x-large;border: 1px solid;margin: 35px;"  ng-click="comment()"> submit</button></div>'
  };
});
