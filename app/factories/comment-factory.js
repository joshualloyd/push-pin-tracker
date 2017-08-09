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
		return $q((resolve, reject)=>{
			$http.get(`${FirebaseUrl}comments.json`)
			.then((commentsData) => {
				console.log('comments from firebase', commentsData);
				let allCommentsArray = [];
				// let commentsArrayByForProject = [];
				let commentsObjects = commentsData.data;
				Object.keys(commentsObjects).forEach((key) => {
					allCommentsArray.push(commentsObjects[key]);
				});
				let commentsArrayByForProject = allCommentsArray.filter((comment) => {
					return comment.project_id === projectId;
				});
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

	return {getComment, getComments, createComment};

});