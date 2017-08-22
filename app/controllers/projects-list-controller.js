'use strict';

pushPinApp.controller('ProjectsListController', function($scope, ProjectFactory, UserFactory, PinFactory, CommentFactory) {

	let currentUser = null;
	let userToken = null;

	$scope.currentUserName = '';

	let fetchProjects = (tokenString) => {
		let projectsArray = [];

		ProjectFactory.getProjects(tokenString)
		.then((projectData)=>{
			console.log('projectData', projectData);

			if (projectData === null) {
				console.log('no projects found', projectData);
				$scope.projects = [];
			} else {
				Object.keys(projectData).forEach((key)=>{
					projectData[key].id = key;
					projectsArray.push(projectData[key]);
				});

				console.log('projectsArray', projectsArray);

				let filteredProjectsArray = projectsArray.filter((project) => {
					if (project.client_uid === currentUser) {
						return true;
					}	else if (project.designer_uid === currentUser) {
						return true;
					} else {
						return false;
					}
				});

				console.log('filteredProjectsArray', filteredProjectsArray);

				$scope.projects = filteredProjectsArray;
			}

		});

	};

	UserFactory.isAuthenticated()
  .then( (user) => {
    // console.log("user status", user);
    currentUser = UserFactory.getUser();
    return UserFactory.getUserToken();
  })
  .then((userTokenString) => {
  	userToken = userTokenString;
  	return UserFactory.getUserInfoByUid(currentUser, userToken);
  })
  .then((userInfoData) => {
  	// console.log('userInfoData', userInfoData);
  	$scope.currentUserName = userInfoData.name;
  	fetchProjects(userToken);
  })
  .catch((err) => {
  	console.log('problems', err);
  });

	// fetchProjects();

	$scope.deleteProject = (project) => {

		// console.log('userToken', userToken);

		CommentFactory.deleteProjectComments(project.id, userToken)
		.then((dataFromDeleteProjectComments) => {
			console.log('data from deleteProjectComments', dataFromDeleteProjectComments);
			return PinFactory.deleteProjectPins(project.id, userToken);
		})
		.then((dataFromDeleteProjectPins) => {
			//need fbStorageRef
			return ProjectFactory.deleteImageFile(project.fbStorageRef);
		})
		.then((dataFromDeleteImageFile) => {
			return ProjectFactory.deleteProject(project.id, userToken);
		})
		.then((dataFromDeleteProject) => {
			console.log('data from deleteProject', dataFromDeleteProject);
			fetchProjects(userToken);
		})
		.catch((err) => {
			console.log('error deleting the project', err);
		});

	};

});