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
  .when('/project/view/:projectId', {
    templateUrl: 'partials/project-detail.html',
    controller: 'ProjectViewController',
    resolve: {isAuth}
  })
  .when('/project/edit/:projectId', {
    templateUrl: 'partials/project-edit-form.html',
    controller: 'ProjectEditController',
    resolve: {isAuth}
  })
  .when('/project/new', {
    templateUrl: 'partials/project-new-form.html',
    controller: 'ProjectAddController',
    resolve: {isAuth}
  })
  .when('/project/manage/:projectId', {
    templateUrl: 'partials/project-manage.html',
    controller: 'ProjectManageController',
    resolve: {isAuth}
  })
  .otherwise('/');
});