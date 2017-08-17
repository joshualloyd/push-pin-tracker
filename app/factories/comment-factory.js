'use strict';

pushPinApp.factory('CommentFactory', function($q, $http, FirebaseUrl) {

	let getComment = (commentId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}comments/${commentId}.json`)
			.then((commentData) => {
				resolve(commentData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let getComments = (projectId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}comments.json`)
			.then((commentsData) => {
				console.log('comments from firebase', commentsData);
				let allCommentsArray = [];

				if (commentsData.data === null) {
					console.log('no comments found', commentsData.data);
					resolve(null);
				}

				Object.keys(commentsData.data).forEach((key) => {
					commentsData.data[key].id = key;
					allCommentsArray.push(commentsData.data[key]);
				});

				console.log('allCommentsArray', allCommentsArray);

				let commentsArrayByForProject = allCommentsArray.filter((comment) => {
					return comment.project_id === projectId;
				});

				if (commentsArrayByForProject === []) {
					console.log('no comments matching project', commentsArrayByForProject);
					resolve([]);
				}

				resolve(commentsArrayByForProject);
			})
			.catch((err)=>{
				reject(err);
			});
		});
	};

	let createComment = (newCommentObj) => {
		return $q((resolve, reject) => {
			$http.post(`${FirebaseUrl}comments.json`, angular.toJson(newCommentObj))
			.then((newCommentData) => {
				resolve(newCommentData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let deleteComment = (commentId) => {
		return $q((resolve, reject) => {
			$http.delete(`${FirebaseUrl}comments/${commentId}.json`)
			.then((deletedCommentData) => {
				resolve(deletedCommentData);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let deletePinComments = (pinId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}comments.json`)
			.then((allCommentsData) => {
				console.log('allCommentsData', allCommentsData.data);
				let allCommentsArray = [];
				if (allCommentsData.data === null) {
					console.log('no comments found', allCommentsData.data);
					resolve(null);
				}

				Object.keys(allCommentsData.data).forEach((key) => {
					allCommentsData.data[key].id = key;
					allCommentsArray.push(allCommentsData.data[key]);
				});

				let pinComments = allCommentsArray.filter((comment) => {
					return comment.pin_id === pinId;
				});
				if (pinComments === []) {
					console.log('no comments linked to pin');
					resolve([]);
				}
				// console.log('comments by pinId', pinComments);
				let deleteCommentPromiseArray = [];
				pinComments.forEach((pinComment) => {
					let pinCommentDelete = deleteComment(pinComment.id);
					deleteCommentPromiseArray.push(pinCommentDelete);
				});
				// console.log('the delete promise array', deleteCommentPromiseArray);
				return $q.all(deleteCommentPromiseArray);
			})
			.then((dataFromCommentArrayDeletion) => {
				resolve(dataFromCommentArrayDeletion);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let deleteProjectComments = (projectId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}comments.json`)
			.then((allCommentsData) => {
				// console.log('allCommentsData', allCommentsData.data);
				let allCommentsArray = [];

				if (allCommentsData.data === null) {
					console.log('no comments found', allCommentsData.data);
					resolve(null);
				}

				Object.keys(allCommentsData.data).forEach((key) => {
					allCommentsData.data[key].id = key;
					allCommentsArray.push(allCommentsData.data[key]);
				});

				let projectComments = allCommentsArray.filter((comment) => {
					return comment.project_id === projectId;
				});

				if (projectComments === []) {
					resolve([]);
				}

				// console.log('comments by pinId', pinComments);
				let deleteCommentPromiseArray = [];
				projectComments.forEach((projectComment) => {
					let projectCommentDelete = deleteComment(projectComment.id);
					deleteCommentPromiseArray.push(projectCommentDelete);
				});
				// console.log('the delete promise array', deleteCommentPromiseArray);
				return $q.all(deleteCommentPromiseArray);
			})
			.then((dataFromCommentArrayDeletion) => {
				resolve(dataFromCommentArrayDeletion);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	return {getComment, getComments, createComment, deleteComment, deletePinComments, deleteProjectComments};

});