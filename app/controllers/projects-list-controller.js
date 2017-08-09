'use strict';

pushPinApp.controller('ProjectsListController', function($scope, ProjectFactory, UserFactory) {

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

});