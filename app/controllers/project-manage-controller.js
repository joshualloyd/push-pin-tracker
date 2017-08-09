'use strict';

pushPinApp.controller('ProjectManageController', function($scope, $window, $routeParams, PinFactory, ProjectFactory, CommentFactory){

	$scope.pin = {
		project_id: $routeParams.projectId
	};

	$scope.manager = 'pins';

	$scope.newComment = {
		project_id: $routeParams.projectId
	};

	fetchPins();
	fetchComments();

	function fetchPins() {
		PinFactory.getPins($routeParams.projectId)
		.then((pinData) => {
			console.log('the pins returned from the factory', pinData);
			$scope.pins = pinData;
		})
		.catch((err)=>{
			console.log('getPins factory method had some issues', err);
		});
	}

	function fetchComments() {
		CommentFactory.getComments($routeParams.projectId)
		.then((commentsData) => {
			console.log('the comments returned from the factory', commentsData);
			$scope.comments = commentsData;
		})
		.catch((err) => {
			console.log('getComments factory method had some trouble', err);
		});
	}


	ProjectFactory.getProject($routeParams.projectId)
	.then((dataFromGetProject) => {
		$scope.project = dataFromGetProject;
	});

	$scope.addPin = (clickEvent) => {
		console.log('you clicked the image', clickEvent);
		if ($scope.manager === 'pins') {
			$scope.pin.xCoord = clickEvent.offsetX;
			$scope.pin.yCoord = clickEvent.offsetY;

			PinFactory.createPin($scope.pin)
			.then((dataFromAddPin) => {
				console.log("new pin data", dataFromAddPin);
				// $window.location.href = `#!/project/manage/${$routeParams.projectId}`;
				fetchPins();
			})
			.catch((err)=>{
				console.log('there was an issue with the addPin factory method', err);
			});
		}

	};

	$scope.selectPin = (pinId) => {
		if ($scope.manager === 'comments') {
			console.log('pin click event while comments toggled', pinId);
			$scope.selectedPin = pinId;
			fetchPins();
		}
	};

	$scope.addComment = () => {
		console.log('you clicked the add comment button');
		$scope.newComment.pin_id = $scope.selectedPin;
		CommentFactory.createComment($scope.newComment)
		.then((dataFromAddComment) => {
			console.log('new comment data', dataFromAddComment);
			fetchComments();
		})
		.catch((err) => {
			console.log('there was an issue with the addComment factory method', err);
		});
	};

});