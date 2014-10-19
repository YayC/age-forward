'use strict';

/* Services */

angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://agefwd.firebaseio.com/')
  .factory('getFirebaseStore', function($firebase, FIREBASE_URL) {
    var getFirebaseStore = function(path){
      path = typeof path !== 'undefined' ? path : '';
      var dataRef = new Firebase(FIREBASE_URL + path);
      return $firebase(dataRef);
    }
    return getFirebaseStore
  })
  .factory('patientService', function(getFirebaseStore) {
    var patients = getFirebaseStore('patients').$asArray;

    var patientServiceObject = {
      savePatient: function(patient) {
       patients.$add(patient);
      },
      getPatientByUserId: function(userId) {
        // var patient = patients(userId) ? patients(userId) : {name: 'Jan Garman'};
        // debugger
        // return patient;
        return {name: 'Jan Garman', caregiverCell: '+13104300717', gender: 'Female', photo: "http://mchenrychamber.com/wp-content/uploads/2013/04/generic-profile.jpg"};
      }
    };

    return patientServiceObject;
  })
// <<<<<<< HEAD
  .factory('visitService', function(getFirebaseStore) {
    // var users = getFirebaseStore('users').$asArray;
    var visits = getFirebaseStore('visits').$asArray();
    var visitServiceObject = {
      saveVisit: function(visit, userId) {
        visits.$add(visit);
      },
      getVisitsByUserId: function(userId) {
        // return users.$child(userId).$child('visits');
        return visits;
      }
    };

    return visitServiceObject;
  })
  .factory('textMessageService', function(getFirebaseStore) {
    var textMessages = getFirebaseStore('textMessages').$asArray();
// =======
// // schema :  Date  and BloodPressure value
//   .EHSinformation('textMessageService', function(dataService) {
//      var EHSinformation = dataService.$child('medicalRecord');
//   var textMessageServiceObject = {
//       EHSinformation: function(party, userId) {
//         var newTextMessage = {
//           date: party.date,
//           bloodPressures: party.bloodPressures
//         };
//         EHSinformation.$add(newTextMessage);
//       }
//    };
//      return textMessageServiceObject;
//   })
// // schema :  Date  and Weight value
//   .pushWeightinformation('textMessageService', function(dataService) {
//      var EHSinformation = dataService.$child('weightRecords');
//      var textMessageServiceObject = {
//       EHSinformation: function(party, userId) {
//         var newTextMessage = {
//           Date: party.Date,
//           weightRecord: party.weightRecord
//         };
//         EHSinformation.$add(newTextMessage);
//       }
//    };
//      return textMessageServiceObject;
//   })


//   .factory('textMessageService', function(dataService, partyService) {
//     var textMessages = dataService.$child('textMessages');
// >>>>>>> 5f79f57b62cfbc82181d5be479e32f58fb23d3be

    var textMessageServiceObject = {
      sendTextMessage: function(phoneNumber, message) {
        textMessages.$add({phoneNumber: phoneNumber, message: message});
        // partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
      }
    };

    return textMessageServiceObject;
  })
  .factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, getFirebaseStore) {
    var authRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseSimpleLogin(authRef);


    var authServiceObject = {
      register: function(user) {
        auth.$createUser(user.email, user.password).then(function(data) {
          console.log(data);
          authServiceObject.login(user, function(){
            var emails = getFirebaseStore('emails').$asArray();
            emails.$add({email: user.email, userId: user.id});
          });
        });
      },
      login: function(user, optionalCallback) {
        auth.$login('password', user).then(function(data) {
          console.log(data);
          if(optionalCallback){
            optionalCallback();
          }
          $location.path('/1/dashboard');
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
  })
  .factory('speechService', function () {

        if(window.speechSynthesis) {
            var msg = new SpeechSynthesisUtterance();

            //calling get voices method first scaffolds it for
            //use in say method
            window.speechSynthesis.getVoices();
        }

        function sayIt(text, config) {
            var voices = window.speechSynthesis.getVoices();
            //choose voice. Fallback to default
            msg.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
            msg.volume = config && config.volume ? config.volume : 1;
            msg.rate = config && config.rate ? config.rate : 1;
            msg.pitch = config && config.pitch ? config.pitch : 1;

            //message for speech
            msg.text = text;

            speechSynthesis.speak(msg);
        }


        return {
            sayText: sayIt
        };
    });
