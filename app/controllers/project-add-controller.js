'use strict';

pushPinApp.controller('ProjectAddController', function($scope, $window, ProjectFactory, UserFactory) {

	console.log('project add controller running');

	$scope.project = {
		designer_id: UserFactory.getUser()
	};

	// $scope.file = {};

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