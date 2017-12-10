    'use strict';

    angular.module('Authentication')

    .controller('LoginController',
        ['$scope', '$rootScope', 'AuthenticationService',
        function ($scope, $rootScope, AuthenticationService) {
            // reset login status
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                AuthenticationService.Login($scope.email, $scope.password, function(response) {
                    if(response.success) {
                        AuthenticationService.SetCredentials($scope.email, $scope.password,response.name);
                          location.href = 'index.html#/';
                    } else {
                      alert(response.message);
                    }
                });

              };
              $scope.register = function () {
                 AuthenticationService.register($scope.reg_name,$scope.reg_email, $scope.reg_password, function(response) {
                   if(response.success) {
                       AuthenticationService.SetCredentials($scope.reg_email, $scope.password, $scope.reg_name);
                      location.href = 'index.html#/';
                   }else {
                        alert(response.message);
                    }
                });
                  } ;
        }]);
