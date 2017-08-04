"use strict";

let pushPinApp = angular.module("PushPinApp", ["ngRoute"])
.constant("FirebaseUrl", "https://push-pin-tracker.firebaseio.com/");

let isAuth = (UserFactory) => {
  return new Promise( (resolve, reject) => {
    UserFactory.isAuthenticated()
    .then( (userBoolean) => {
      if(userBoolean) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

pushPinApp.config( ($routeProvider) => {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/login.html',
    controller: 'UserController'
  })
  .when('/projects/view', {
    templateUrl: 'partials/projects-list.html',
    controller: 'ProjectsListController',
    resolve: {isAuth}
  })
  .otherwise('/');
});