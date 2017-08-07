'use strict';

pushPinApp.controller('ProjectViewController', function($scope, $routeParams, ProjectFactory){

	ProjectFactory.getProject($routeParams.projectId)
	.then((dataFromGetProject) => {
		$scope.project = dataFromGetProject;
	});

});