'use strict';

pushPinApp.controller('ProjectManageController', function($scope, $window, $routeParams, PinFactory, ProjectFactory, CommentFactory, UserFactory){

	let userToken = null;
	let currentUserUid = UserFactory.getUser();

	$scope.currentUserName = null;

	$scope.pin = {
		project_id: $routeParams.projectId
	};

	$scope.manager = 'pins';

	$scope.newComment = {
		project_id: $routeParams.projectId,
		commenter_uid: currentUserUid
	};

	function fetchPins() {
		PinFactory.getPins($routeParams.projectId, userToken)
		.then((pinData) => {
			console.log('the pins returned from the factory', pinData);
			// pinData.forEach((pin) => {
			// 	pin.commentCount = 0;
			// });
			$scope.pins = pinData;
			updateCommentCount();
		})
		.catch((err)=>{
			console.log('getPins factory method had some issues', err);
		});
	}

	function fetchComments() {
		CommentFactory.getComments($routeParams.projectId, userToken)
		.then((commentsData) => {
			console.log('the comments returned from the factory', commentsData);
			let finishedComments = commentsData.map((comment) => {
				if (comment.commenter_uid === $scope.project.designer_uid) {
					comment.commenter_name = $scope.project.designerName;
					return comment;
				} else if (comment.commenter_uid === $scope.project.client_uid) {
					comment.commenter_name = $scope.project.clientName;
					return comment;
				}	else {
					console.log('no matching commenter name', comment.commenter_uid);
				}
			});

			console.log('finishedComments', finishedComments);

			// finishedComments.forEach((comment) => {
			// 	console.log('comment',comment);
			// 	// $scope.pins[comment.pin_id].commentCount += 1;
			// 	$scope.pins.forEach((pin) => {
			// 		if (pin.id === comment.pin_id) {
			// 			pin.commentCount += 1;
			// 		}
			// 	});
			// });

			$scope.comments = finishedComments;
			updateCommentCount();

		})
		.catch((err) => {
			console.log('getComments factory method had some trouble', err);
		});
	}

	function updateCommentCount() {
		$scope.pins.forEach((pin) => {
			pin.commentCount = 0;
		});

		$scope.comments.forEach((comment) => {
			$scope.pins.forEach((pin) => {
				if (pin.id === comment.pin_id) {
					pin.commentCount += 1;
				}
			});
		});
	}

	UserFactory.getUserToken()
	.then((userTokenString) => {
		userToken = userTokenString;
		return UserFactory.getUserInfoByUid(currentUserUid, userToken);
	})
	.then((userInfoData) => {
		$scope.currentUserName = userInfoData.name;
		return ProjectFactory.getProject($routeParams.projectId, userToken);
	})
	.then((dataFromGetProject) => {
		$scope.project = dataFromGetProject;
		return UserFactory.getUserInfoByUid($scope.project.designer_uid, userToken);
	})
	.then((designerData) => {
		console.log('designerData', designerData);
		$scope.project.designerName = designerData.name;
		return UserFactory.getUserInfoByUid($scope.project.client_uid, userToken);
	})
	.then((clientData) => {
		$scope.project.clientName = clientData.name;
		fetchPins();
		fetchComments();
		// updateCommentCount();
	})
	.catch((err) => {
		console.log('issue with project, designer or client', err);
	});

	$scope.addPin = (clickEvent) => {
		console.log('you clicked the image', clickEvent);
		if ($scope.manager === 'pins') {
			$scope.pin.xCoord = clickEvent.offsetX;
			$scope.pin.yCoord = clickEvent.offsetY;
			$scope.pin.name = $scope.newPin.name;

			PinFactory.createPin($scope.pin, userToken)
			.then((dataFromAddPin) => {
				console.log("new pin data", dataFromAddPin);
				$scope.newPin.name = '';
				fetchPins();
				// fetchComments();

			})
			.catch((err) => {
				console.log('there was an issue with the addPin factory method', err);
			});
		}

	};

	$scope.selectPin = (pinId) => {
		if ($scope.manager === 'comments') {
			console.log('pin click event while comments toggled', pinId);
			$scope.selectedPin = pinId;
			// fetchPins();
			// fetchComments();
		}
	};

	$scope.addComment = () => {
		console.log('you clicked the add comment button');
		$scope.newComment.pin_id = $scope.selectedPin;
		CommentFactory.createComment($scope.newComment, userToken)
		.then((dataFromAddComment) => {
			console.log('new comment data', dataFromAddComment);
			$scope.newComment.commenter_uid = UserFactory.getUser();
			$scope.newComment.description = '';
			// fetchPins();
			fetchComments();
		})
		.catch((err) => {
			console.log('there was an issue with the addComment factory method', err);
		});
	};

	$scope.deleteComment = (commentId) => {
		console.log('commentId', commentId);
		CommentFactory.deleteComment(commentId, userToken)
		.then((dataFromDeleteComment) => {
			console.log('a comment was deleted', dataFromDeleteComment);
			// fetchPins();
			fetchComments();
		})
		.catch((err) => {
			console.log('there was an issue with the deleteComment factory method', err);
		});
	};

	$scope.deletePin = (pinId) => {
		console.log('userToken', userToken);
		CommentFactory.deletePinComments(pinId, userToken)
		.then((dataFromDeletePinComments) => {
			return PinFactory.deletePin(pinId, userToken);
		})
		.then((dataFromDeletePin) => {
			console.log('dataFromDeletePin', dataFromDeletePin);
			fetchPins();
			// fetchComments();
		})
		.catch((err) => {
			console.log('deletePinComments factory method issue', err);
		});
	};

});