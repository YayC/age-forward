'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('LandingPageController', ['$rootScope', function($rootScope) {
    $rootScope.onDashboard = false;
  }])
  .controller('DashboardController', ['$rootScope', '$scope', 'patientService', 'visitService', 'textMessageService', 'authService', '$routeParams', 'speechService', '$timeout', '_', function($rootScope, $scope, patientService, visitService, textMessageService, authService, $routeParams, speechService, $timeout, _) {

    // Bind user's parties to $scope.parties.
    // authService.getCurrentUser().then(function(user) {
    //   if (user) {
    //     $scope.visits = visitService.getVisitsByUserId(user.id);
    //   };
    // });




    $rootScope.onDashboard = true;
    $scope.subjectUserId = $routeParams["userId"] !== 'undefined' ? $routeParams["userId"] : "";;
    $scope.visits = visitService.getVisitsByUserId($scope.subjectUserId);
    $scope.patient = patientService.getPatientByUserId($scope.subjectUserId);
    $scope.showVisitForm = false;
    $scope.author = typeof $scope.currentUser !== 'undefined' ? $scope.currentUser : "";

    // Alerts
    //
    $scope.fadingSuccessAlert = false;
    $scope.doFade = false;

    $scope.alertSuccess = function(msg){

      //reset
      $scope.fadingSuccessAlert = false;
      $scope.doFade = false;

      $scope.fadingSuccessAlert = true;

      $scope.alertMessage = msg;

      $timeout(function(){
        $scope.doFade = true;
      }, 2500);
    };

    // Object to store data from the waitlist form.
    $scope.newVisit = {visitNote: '', authorUserId: $scope.author, scheduledStart: '', completedAt: '', subjectUserId: $scope.subjectUserId};

    // Function to save a new party to the waitlist.
    $scope.saveVisit = function() {
      visitService.saveVisit($scope.newVisit, $scope.subjectUserId);
      $scope.newVisit = {visitNote: '', authorUserId: $scope.currentUser, scheduledStart: '', completedAt: '', subjectUserId: $scope.subjectUserId};
    };

    // Function to send a text message to a party.
    $scope.completeVisit = function() {
      var visit = $scope.newVisit;
      $scope.saveVisit();
      $scope.showVisitForm = false;
      // visitService.getVisitsByUserId(userId).$child(visit.$id).$update({completedAt: new Date()});
      var message = $scope.patient.name + "'s visit is complete and the summary is available online: " + visit.visitNote;
      textMessageService.sendTextMessage($scope.patient.caregiverCell, message);
      $scope.alertSuccess('Successfully uploaded!');
    };



    //Map
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };
    $scope.marker = {
          id: 0,
          coords: {
            latitude: 45,
            longitude: -73
          },
          options: { draggable: true },
          events: {
            dragend: function (marker, eventName, args) {
              var lat = marker.getPosition().lat();
              var lon = marker.getPosition().lng();

              $scope.marker.options = {
                draggable: true,
                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                labelAnchor: "100 0",
                labelClass: "marker-labels"
              };
            }
          }
        };
    // $scope.marker = {};
    // $scope.marker.options = {
    //             draggable: true,
    //             labelContent: "lat: " + $scope.map.center.latitude + ' ' + 'lon: ' + $scope.map.longitude,
    //             labelAnchor: "100 0",
    //             labelClass: "marker-labels"
    //           };

    //// text to speech
    // $scope.openSpeechOptions = function () {

    // var modalInstance = $modal.open({
    //   templateUrl: 'textToSpeechOptions.html',
    //   controller: 'DashboardController',
    //   size: 'lg'
    //   // resolve: {
    //   //   items: function () {
    //   //     return $scope.items;
    //   //   }
    //   // }
    // });

    // $scope.speechOptionsOk = function () {
    //   $modalInstance.close();
    // };

    // $scope.speechOptionsCancel = function () {
    //   $modalInstance.dismiss('cancel');
    // };

    $scope.speaking = window.speechSynthesis.speaking;

    $scope.stopSpeaking = function(){
      window.speechSynthesis.cancel()
    }

    $scope.summaryText = [
      "Jan has no new reported hospitalizations since your last visit on September 19th.",
      "Vitals, including 21 Glucose readings and 5 blood pressure readings, were all within normal limits.",
      "Note from daughter Kim on September 25th:. quote. just spoke with mom, she forgot to mention a new blood thinner she's taking.",
      "I'm also worried that she's not getting out as much recently. Thanks Kim, you're an angel. end quote."
    ]

    $scope.voices = [
      {name: "US English Accent"},
      {name: "UK English Male Accent"},
      {name: "UK English Female Accent"},
      {name: "Spain Accent"},
      {name: "French Accent"},
      {name: "Italian Accent"},
      {name: "German Accent"},
      {name: "Japanese Accent"},
      {name: "Korean Accent"},
      {name: "Chinese Accent"},
      {name: "Alex"},
      {name: "Agnes"},
      {name: "Albert"},
      {name: "Bad News"},
      {name: "Bahh"},
      {name: "Bells"},
      {name: "Boing"},
      {name: "Bruce"},
      {name: "Bubbles"},
      {name: "Cellos"},
      {name: "Deranged"},
      {name: "Fred"},
      {name: "Good News"},
      {name: "Hysterical"},
      {name: "Junior"},
      {name: "Kathy"},
      {name: "Pipe Organ"},
      {name: "Princess"},
      {name: "Ralph"},
      {name: "Trinoids"},
      {name: "Vicki"},
      {name: "Victoria"},
      {name: "Whisper"},
      {name: "Zarvox"}
    ];

    $scope.pitch = 1;
    $scope.rate = 1;
    $scope.volume = 1;
    $scope.voiceOptionSelected = 1;

    $scope.setVoiceOptions = function () {
      var voiceIdx = $scope.voices.indexOf($scope.voiceOptionSelected)
      $scope.config = {
        voiceIndex: voiceIdx,
        rate: $scope.rate,
        pitch: $scope.pitch,
        volume: $scope.volume
      };
    }
    $scope.saySummary = function(){
      $scope.setVoiceOptions();
      if(window.speechSynthesis) {
        speechService.sayText($scope.summaryText, $scope.config);
        // _($scope.summaryText).each(function(sentence){
        //   setTimeout(function(){speechService.sayText(sentence, $scope.config);}, 10)

        // })
      } else {
        alert('Sorry, speech not supported for this device');
      }
    }


  }])
  .controller('AuthController', ['$scope', 'authService', function($scope, authService) {

    // Object bound to inputs on the register and login pages.
    $scope.user = {email: '', password: ''};

    // Method to register a new user using the authService.
    $scope.register = function() {
      console.log('calling authService register')
      authService.register($scope.user);
    };

    // Method to log in a user using the authService.
    $scope.login = function() {
      authService.login($scope.user);
    };

    // Method to log out user using the authService.
    $scope.logout = function() {
      authService.logout();
    };

  }]);
