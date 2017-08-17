'use strict';

pushPinApp.controller('ProjectsListController', function($scope, ProjectFactory, UserFactory, PinFactory, CommentFactory) {

	$scope.heading = 'My Projects';

	let fetchProjects = () => {
		let projectsArray = [];

		ProjectFactory.getProjects()
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
				$scope.projects = projectsArray;
			}

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