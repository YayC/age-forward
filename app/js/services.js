'use strict';

/* Services */

angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://agefwd.firebaseio.com/')
  .factory('dataService', function($firebase, FIREBASE_URL) {
    var dataRef = new Firebase(FIREBASE_URL);
    var fireData = $firebase(dataRef);

    return fireData;
  })
  .factory('partyService', function(dataService) {
    var users = dataService.$child('users');

    var partyServiceObject = {
      saveParty: function(party, userId) {
        users.$child(userId).$child('parties').$add(party);
      },
      getPartiesByUserId: function(userId) {
        return users.$child(userId).$child('parties');
      }
    };

    return partyServiceObject;
  })
// schema :  Date  and BloodPressure value
  .EHSinformation('textMessageService', function(dataService, partyService) {
     var EHSinformation = dataService.$child('medicalRecord');
  var textMessageServiceObject = {
      EHSinformation: function(party, userId) {
        var newTextMessage = {
          date: party.date,
          bloodPressures: party.bloodPressures
        };
        EHSinformation.$add(newTextMessage);
        partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
      }
   };
     return textMessageServiceObject;
  })
// schema :  Date  and Weight value
  .pushWeightinformation('textMessageService', function(dataService, partyService) {
     var EHSinformation = dataService.$child('weightRecords');
  var textMessageServiceObject = {
      EHSinformation: function(party, userId) {
        var newTextMessage = {
          Date: party.Date,
          weightRecord: party.weightRecord
        };
        EHSinformation.$add(newTextMessage);
        partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
      }
   };
     return textMessageServiceObject;
  })


  .factory('textMessageService', function(dataService, partyService) {
    var textMessages = dataService.$child('textMessages');

    var textMessageServiceObject = {
      sendTextMessage: function(party, userId) {
        var newTextMessage = {
          phoneNumber: party.phone,
          size: party.size,
          name: party.name
        };
        textMessages.$add(newTextMessage);
        partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
      }
    };

    return textMessageServiceObject;
  })
  .factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService) {
    var authRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseSimpleLogin(authRef);
    var emails = dataService.$child('emails');

    var authServiceObject = {
      register: function(user) {
        console.log('in register')
        auth.$createUser(user.email, user.password).then(function(data) {
          console.log(data);
          authServiceObject.login(user, function(){
            emails.$add({email: user.email});
          });
        });
      },
      login: function(user, optionalCallback) {
        auth.$login('password', user).then(function(data) {
          console.log(data);
          if(optionalCallback){
            optionalCallback();
          }
          $location.path('/waitlist');
        });
      },
      logout: function() {
        auth.$logout();
        $location.path('/');
      },
      getCurrentUser: function() {
        return auth.$getCurrentUser();
      }
    };

    $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
      $rootScope.currentUser = user;
    });

    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
      $rootScope.currentUser = null;
    });

    return authServiceObject;
  });
