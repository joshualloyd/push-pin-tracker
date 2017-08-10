'use strict';

pushPinApp.controller('ProjectsListController', function($scope, ProjectFactory, UserFactory, PinFactory, CommentFactory) {

	$scope.heading = 'My Projects';

	let fetchProjects = () => {
		let projectsArray = [];
		ProjectFactory.getProjects()
		.then((projectData)=>{
			let projectsObjects = projectData.data;
			console.log('projectsObjects', projectsObjects);
			Object.keys(projectsObjects).forEach((key)=>{
				projectsObjects[key].id = key;
				projectsArray.push(projectsObjects[key]);
			});
			console.log('projectsArray', projectsArray);
			$scope.projects = projectsArray;
		});
	};

	fetchProjects();

	$scope.deleteProject = (project) => {

		CommentFactory.deleteProjectComments(project.id)
		.then((dataFromDeleteProjectComments) => {
			console.log('data from deleteProjectComments', dataFromDeleteProjectComments);
			return PinFactory.deleteProjectPins(project.id);
		})
		.then((dataFromDeleteProjectPins) => {
			//need fbStorageRef
			return ProjectFactory.deleteImageFile(project.fbStorageRef);
		})
		.then((dataFromDeleteImageFile) => {
			return ProjectFactory.deleteProject(project.id);
		})
		.then((dataFromDeleteProject) => {
			console.log('data from deleteProject', dataFromDeleteProject);
			fetchProjects();
		})
		.catch((err) => {
			console.log('error deleting the project', err);
		});

	};

});