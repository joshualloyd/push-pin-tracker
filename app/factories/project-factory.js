'use strict';

pushPinApp.factory('ProjectFactory', function($q, $http, FirebaseUrl){

	let createNewProject = (newProjectObj, imageUrl, userToken) => {
		newProjectObj.fbStorageRef = `images/${newProjectObj.file.name}`;
		newProjectObj.imageUrl = imageUrl;
		return $q((resolve, reject) => {
			$http.post(`${FirebaseUrl}projects.json?auth=${userToken}`, angular.toJson(newProjectObj))
			.then((newProjectData) => {
				resolve(newProjectData);
			})
			.catch((err)=>{
				reject(err);
			});
		});
	};

	let getProjects = (userToken) => {
		console.log('userToken', userToken);
		console.log('test url for getting projects', `${FirebaseUrl}projects.json?auth=${userToken}`);
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}projects.json?auth=${userToken}`)
			.then((projectsData)=>{
				resolve(projectsData.data);
			})
			.catch((err)=>{
				reject(err);
			});
		});
	};

	let getProject = (projectId, userToken) => {
		// console.log('is this get project factory method running', projectId);
		return $q((resolve, reject) => {
			// console.log('testing get project URL', `${FirebaseUrl}projects/${projectId}.json`);
			$http.get(`${FirebaseUrl}projects/${projectId}.json?auth=${userToken}`)
			.then((projectData) => {
				// console.log('project data?', projectData);
				resolve(projectData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let uploadImageFile = (fileObj) => {
		return $q((resolve, reject) => {
			console.log('file upload factory method called', fileObj);
			// let file = fileObj.name;
			let storageRef = firebase.storage().ref(`images/${fileObj.name}`);
			let uploadTask = storageRef.put(fileObj);

			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			  function(snapshot) {
			    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			    // uploaderBar.value = progress;
			    console.log('Upload is ' + progress + '% done');
			    switch (snapshot.state) {
			      case firebase.storage.TaskState.PAUSED: // or 'paused'
			        console.log('Upload is paused');
			        break;
			      case firebase.storage.TaskState.RUNNING: // or 'running'
			        console.log('Upload is running');
			        break;
			    }
			  }, function(error) {
			  	reject(error);

			  // A full list of error codes is available at
			  // https://firebase.google.com/docs/storage/web/handle-errors
			  switch (error.code) {
			    case 'storage/unauthorized':
			      // User doesn't have permission to access the object
			      break;

			    case 'storage/canceled':
			      // User canceled the upload
			      break;

			    case 'storage/unknown':
			      // Unknown error occurred, inspect error.serverResponse
			      break;
			  }
			}, function() {
			  // Upload completed successfully, now we can get the download URL
			  var downloadURL = uploadTask.snapshot.downloadURL;
			  console.log('downloadURL', downloadURL);
			  resolve(downloadURL);
			});


		});
	};

	let deleteImageFile = (fbStorageRef) => {

		return $q((resolve, reject) => {
			// Create a reference to the file to delete
			var deleteRef = firebase.storage().ref(fbStorageRef);

			// Delete the file
			deleteRef.delete()
			.then((success) => {
			  // File deleted successfully
			  console.log('file deleted successfully', success);
			  resolve(success);
			}).catch(function(error) {
			  // Uh-oh, an error occurred!
			  console.log('Uh-oh, an error occurred', error);
			  reject(error);
			});
		});

	};

	let editProject = (projectObj, projectId, userToken) => {
		console.log('project data to be updated', projectObj);
		return $q((resolve, reject) => {
			if (projectObj && projectId) {
				$http.put(`${FirebaseUrl}projects/${projectId}.json?auth=${userToken}`,
					angular.toJson(projectObj))
				.then((editedProjectData) => {
					resolve(editedProjectData);
				})
				.catch((err) => {
					reject(err);
				});
			} else {
				console.log('need a projectObj and projectId', projectObj , projectId);
			}
		});
	};

	let deleteProject = (projectId, userToken) => {
		return $q((resolve, reject) => {
			if (projectId) {
				$http.delete(`${FirebaseUrl}projects/${projectId}.json?auth=${userToken}`)
				.then((deleteProjectData) => {
					resolve(deleteProjectData);
				})
				.catch((err) => {
					reject(err);
				});
			}
		});
	};

	return {createNewProject, getProjects, uploadImageFile, getProject, editProject, deleteProject, deleteImageFile};

});


