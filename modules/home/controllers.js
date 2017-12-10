'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope','$http',
    function ($scope,$http) {

// Simple GET request example:
$http({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/posts'
}).then(function successCallback(response) {
$scope.news = response.data;
  console.log($scope.news );
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
}])
.directive('myNews', function() {
  return {
    template: "<div  ng-repeat='p in news | limitTo:-5'><div class='hover col-sm-4 col-md-4 col-lg-4'><a href='index.html#/news/{{p.id}}'><p class='demo-title'></p><div class='module'><div class='thumbnail'><img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg'><div class='date'>"+
    '<div>27</div><div>Mar</div></div></div><div class="content"><div class="category">News</div><h1 class="title">{{p.title}}</h1>'+
    '<p class="description">{{p.body}}</p>'+
    '<div class="meta"><span class="timestamp" style="margin-right: 10px;"><i class="fa fa-clock-o"></i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#">  comments</a> </span></div></div></div></div></a>'
  };
});
