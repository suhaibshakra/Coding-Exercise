'use strict';

angular.module('Authentication')

.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};
        var response = { success: false };
        service.Login = function (login_email, login_password, callback) {
                var response = { success: email == 'admin@admin.com' && password == 'password' };
                var transaction = $rootScope.db.transaction(["newsBlogDB"], "readonly");

          // report on the success of the transaction completing, when everything is done
          transaction.oncomplete = function(event) {
            console.log('Transaction completed');
          };

          transaction.onerror = function(event) {
            console.log('Transaction not opened due to error. Duplicate items not allowed');
          };

          // create an object store on the transaction
          var objectStore = transaction.objectStore("newsBlogDB");
          var email = objectStore.index("email");
          var password = objectStore.index("password");
          var check_email = email.get(login_email);
          var check_password = password.get(login_password);


        	check_email.onsuccess = function(e) {
        		var match = e.target.result;
        		if(match) {
        			console.log("Match");
        			console.dir(match);
             check_email = true;
             check_password.onsuccess = function(e) {
               var match = e.target.result;
               if(match) {
                 console.log("Match");
                 console.dir(match);
                check_password = true;
                response.name = match.name;
                response.success = true ;

                   }
             if(!response.success) {
               response.message = 'Email or Password is incorrect';
                       }
             callback(response);

           }

         }else {
           if(!response.success) {
             response.message = 'Email or Password is incorrect';
                     }
           callback(response);
         }

        }


              };
        service.register = function (reg_name,reg_email, reg_password, callback) {
          // create a reference to the notifications list in the bottom of the app; we will write database messages into this list by
          var response = { success: true };


          // Create a new item to add in to the object store
          
          var newUser = { password: reg_password, email: reg_email, name: reg_name };

          // open a read/write db transaction, ready for adding the data
            var transaction = $rootScope.db.transaction(["newsBlogDB"], "readwrite");

            // report on the success of the transaction completing, when everything is done
            transaction.oncomplete = function(event) {
              console.log('Transaction completed');
            };

            transaction.onerror = function(event) {
              console.log('Transaction not opened due to error. Duplicate items not allowed');
            };

            // create an object store on the transaction
            var objectStore = transaction.objectStore("newsBlogDB");
            var index = objectStore.index("email");
            console.log(index);

            var check = index.get(reg_email);

          	check.onsuccess = function(e) {
          		console.log('match call');
          		var match = e.target.result;
          		if(match) {
          			console.log("Match");
          			console.dir(match);
               response.success = false;

          }
          if(!response.success) {
              response.message = 'This Email already taken';
              callback(response);
          }else{
           var objectStoreRequest = objectStore.add(newUser);
           objectStoreRequest.onsuccess = function(e) {
             callback(response);
          }
  }

}


          // objectStore.openCursor().onsuccess = function(e) {
          //     var cursor = e.target.result;
          //
          //    console.log("**************************************");
          //
          //    console.log(cursor);
          //    console.log("**************************************");
          //     if(cursor) {
          //         for(var field in cursor.value) {
          //           console.log(field);
          //           console.log(cursor.value[field]);
          //
          //         }
          //         cursor.continue();
          //     }
          //     console.log("**************************************");
          // }
          //  objectStore.get("admin@admin.com").onsuccess = function(event) {
          //
          //    console.log("=======================================================");
          //
          //    console.log(event);
          //    console.log("=======================================================");
          //
          //  };
          // // make a request to add our newItem object to the object store
          // // var objectStoreRequest = objectStore.add(newUser);
          // console.log("getAll " + objectStore.getAll());
          // objectStore.getAll().onsuccess = function(event) {
          //     console.log(event);
          //   };
          //
          // objectStoreRequest.onsuccess = function(event) {
          //   console.log('Request successful');
          // }


        };
        service.SetCredentials = function (email, password,name) {
            var authdata = Base64.encode(email + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    name: name,
                    email: email,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };


        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;
    }])

.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, b-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});
