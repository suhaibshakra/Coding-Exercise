'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('News', []);
angular.module('Setting', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies',
    'News',
    'Setting',
])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })

        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })

        .when('/news/:id', {
            controller: 'NewsController',
            templateUrl: 'modules/news/views/news.html'
        })
        .when('/setting', {
        controller: 'SettingController',
        templateUrl: 'modules/setting/views/setting.html'
        })
        .otherwise({ redirectTo: '/' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        $("#view").css("margin-top", "20% !important");
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });

        window.onload = function() {

        $rootScope.DBDeleteRequest = window.indexedDB.deleteDatabase("newsBlogDB00");

        $rootScope.DBDeleteRequest.onerror = function(event) {
          console.log("Error deleting database.");
        };

        $rootScope.DBDeleteRequest.onsuccess = function(event) {
          console.log("Database deleted successfully");

          console.log(event.result); // should be undefined
          // note.innerHTML += '<li>App initialised.</li>';
          // In the following line, you should include the prefixes of implementations you want to test.
          // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
          // DON'T use "var indexedDB = ..." if you're not in a function.
          // Moreover, you may need references to some window.IDB* objects:
          // window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
          // window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
          // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)


          // Let us open our database
          $rootScope.DBOpenRequest = window.indexedDB.open("newsBlogDB", 4);
          console.dir( $rootScope.DBOpenRequest);

          // Gecko-only IndexedDB temp storage option:
          // var request = window.indexedDB.open("toDoList", {version: 4, storage: "temporary"});

          // these two event handlers act on the database being opened successfully, or not
          $rootScope.DBOpenRequest.onerror = function(event) {
            console.log("Error loading database.");
          };

          $rootScope.DBOpenRequest.onsuccess = function(event) {
            console.log("Database initialised");

            // store the result of opening the database in the db variable. This is used a lot below
            $rootScope.db = $rootScope.DBOpenRequest.result;
            console.log("db "+ $rootScope.db);



            // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
            // displayData();

        };
        // This event handles the event whereby a new version of the database needs to be created
        // Either one has not been created before, or a new version number has been submitted via the
        // window.indexedDB.open line above
        //it is only implemented in recent browsers
        $rootScope.DBOpenRequest.onupgradeneeded = function(event) {
          $rootScope.db = event.target.result;
          console.log("db1 "+ $rootScope.db);
          $rootScope.db.onerror = function(event) {
            console.log("Error loading database.1");

          };



          $rootScope.objectStore = $rootScope.db.createObjectStore("newsBlogDB", { keyPath: "id", autoIncrement:true });

          // define what data items the objectStore will contain

          $rootScope.objectStore.createIndex("email", "email", { unique: true });
          $rootScope.objectStore.createIndex("name", "name", { unique: false });
          $rootScope.objectStore.createIndex("password", "password", { unique: false });

      $rootScope.objectStore = $rootScope.db.createObjectStore("comments", { keyPath: "id", autoIncrement:true });

      // define what data items the objectStore will contain

      $rootScope.objectStore.createIndex("post_id", "post_id", { unique: false });
      $rootScope.objectStore.createIndex("comment", "comment", { unique: false });
      $rootScope.objectStore.createIndex("user_id", "user_id", { unique: false });


          console.log("Object store created.");

        };

              };


            };
    }]);
