'use strict';

console.log('is this project edit controller even loading?');

pushPinApp.controller('ProjectEditController', function($scope, $window, $routeParams, ProjectFactory) {

	console.log('is this project edit controller running?');

	ProjectFactory.getProject($routeParams.projectId)
	.then((projectData) => {
		$scope.project = projectData;
	})
	.catch((err)=>{
		console.log('the get project factory method failed', err);
	});

	$scope.editProject = () => {
		ProjectFactory.editProject($scope.project)
		.then((dataFromEditProject) => {
			console.log('data from edit project', dataFromEditProject);
			$window.location.href = '#!/projects/view';
		})
		.catch((err)=>{
			console.log('edit project method encountered an error', err);
		});
	};

});