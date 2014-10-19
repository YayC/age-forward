'use strict';

var lodash = angular.module('lodash', []);
lodash.factory('_', function() {
  return window._; // must already be loaded on the page
});

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'firebase',
  'lodash'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/landing_page.html',
    controller: 'LandingPageController'
  });
  $routeProvider.when('/:userId/dashboard', {
    templateUrl: 'partials/dashboard.html',
    controller: 'DashboardController'
  });
  $routeProvider.when('/register', {
    templateUrl: 'partials/register.html',
    controller: 'AuthController'
  });
  $routeProvider.when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'AuthController'
  });
  // $routeProvider.when('/dashboard', {
  //   templateUrl: 'partials/dashboard.html',
  //   controller: 'DashboardController'
  // });
  $routeProvider.otherwise({redirectTo: '/'});
}]);
