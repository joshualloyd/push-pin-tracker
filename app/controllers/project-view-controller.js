'use strict';

pushPinApp.controller('ProjectViewController', function($scope, $routeParams, ProjectFactory, UserFactory){

	let userToken = null;

	UserFactory.getUserToken()
	.then((tokenString) => {
		userToken = tokenString;
		fetchProject(userToken);
	})
	.catch((err) => {
		console.log("error", err);
	});

	function fetchProject(userToken) {
		ProjectFactory.getProject($routeParams.projectId, userToken)
		.then((dataFromGetProject) => {
			console.log('dataFromGetProject', dataFromGetProject);
			$scope.project = dataFromGetProject;
		})
		.catch((err) => {
			console.log("error", err);
		});
	}

});