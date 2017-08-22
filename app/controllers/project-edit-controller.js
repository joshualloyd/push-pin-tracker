'use strict';

pushPinApp.controller('ProjectEditController', function($scope, $window, $routeParams, ProjectFactory, UserFactory) {

	let userToken = null;

	UserFactory.getUserToken()
	.then((userTokenString) => {
		userToken = userTokenString;
		fetchProject(userToken);
	})
	.catch((err)=>{
		console.log('the get project factory method failed', err);
	});

	function fetchProject(userToken) {
		ProjectFactory.getProject($routeParams.projectId, userToken)
		.then((projectData) => {
			console.log('projectData', projectData);
			$scope.project = projectData;
			console.log('project scope', $scope.project);
		})
		.catch((err)=>{
			console.log('the get project factory method failed', err);
		});
	}

	$scope.editProject = () => {
		ProjectFactory.editProject($scope.project, $routeParams.projectId, userToken)
		.then((dataFromEditProject) => {
			console.log('data from edit project', dataFromEditProject);
			$window.location.href = '#!/projects/view';
		})
		.catch((err) => {
			console.log('edit project method encountered an error', err);
		});
	};

});