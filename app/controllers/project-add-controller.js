'use strict';

pushPinApp.controller('ProjectAddController', function($scope, $window, ProjectFactory, UserFactory) {

	let currentUser = null;
	let userToken = null;

	$scope.project = {
		designer_uid: UserFactory.getUser()
	};

		UserFactory.isAuthenticated()
	  .then( (user) => {
	    // console.log("user status", user);
	    currentUser = UserFactory.getUser();
	    return UserFactory.getUserToken();
	  })
	  .then((userTokenString) => {
	  	userToken = userTokenString;
	  	fetchClients(userToken);
	  })
	  .catch((err) => {
	  	console.log('problems', err);
	  });

	function fetchClients(userToken) {
		UserFactory.getClients(userToken)
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
			return ProjectFactory.createNewProject($scope.project, dataFromUploadImageFile, userToken);
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