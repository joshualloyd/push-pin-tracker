'use strict';

pushPinApp.controller('ProjectAddController', function($scope, $window, ProjectFactory, UserFactory) {

	console.log('project add controller running');

	$scope.project = {
		designer_uid: UserFactory.getUser()
	};

	fetchClients();

	function fetchClients() {
		UserFactory.getClients()
		.then((dataFromGetClients) => {
			console.log('all the clients', dataFromGetClients);
			$scope.clients = dataFromGetClients;
		})
		.catch((err) => {
			console.log('issue with getClients', err);
		});
	}

	$scope.saveNewProject = () => {
		// console.log('project data', $scope.project);
		ProjectFactory.uploadImageFile($scope.project.file)
		.then((dataFromUploadImageFile)=>{
			console.log('new project image', dataFromUploadImageFile);
			return ProjectFactory.createNewProject($scope.project, dataFromUploadImageFile);
		})
		.then((dataFromCreateNewProject)=>{
			console.log('data from create new project', dataFromCreateNewProject);
			$window.location.href = '#!/projects/view';
		})
		.catch((err)=>{
			console.log('error from saving new project', err);
		});
	};

});