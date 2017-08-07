'use strict';

pushPinApp.controller('ProjectManageController', function($scope, $window, $routeParams, PinFactory, ProjectFactory){

	$scope.pin = {
		project_id: $routeParams.projectId
	};

	ProjectFactory.getProject($routeParams.projectId)
	.then((dataFromGetProject) => {
		$scope.project = dataFromGetProject;
	});

	$scope.addPin = (clickEvent) => {
		console.log('you clicked the image', clickEvent);
		$scope.pin.xCoord = clickEvent.offsetX;
		$scope.pin.yCoord = clickEvent.offsetY;
		PinFactory.createPin($scope.pin)
		.then((dataFromAddPin) => {
			console.log("new pin data", dataFromAddPin);
			$window.location.href = `#!/project/manage/${$routeParams.projectId}`;
		})
		.catch((err)=>{
			console.log('there was an issue with the addPin factory method', err);
		});
	};

});