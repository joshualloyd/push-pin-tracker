'use strict';

pushPinApp.factory('PinFactory', function($q, $http, FirebaseUrl) {

	let createPin = (newPinObj, userToken) => {
		return $q((resolve, reject) => {
			$http.post(`${FirebaseUrl}pins.json?auth=${userToken}`, angular.toJson(newPinObj))
			.then((newPinData) => {
				resolve(newPinData);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let getPin = (pinId, userToken) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}pins/${pinId}.json?auth=${userToken}`)
			.then((pinData) => {
				resolve(pinData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let getPins = (projectId, userToken) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}pins.json?auth=${userToken}`)
			.then((pinsData) => {
				let pinsArray = [];
				// let pinsObjects = pinsData.data;

				if (pinsData.data === null) {
					console.log('no pins found',pinsData.data);
					resolve(null);
				}

				Object.keys(pinsData.data).forEach((key) => {
					pinsData.data[key].id = key;
					pinsArray.push(pinsData.data[key]);
				});

				let filteredPinsArray = pinsArray.filter((pin) => {
					return pin.project_id === projectId;
				});

				if (filteredPinsArray === []) {
					console.log('no pins associated with project', filteredPinsArray);
					resolve([]);
				}

				resolve(filteredPinsArray);
			})
			.catch((err) => {
				console.log('getPins had an issue with firebase', err);
				reject(err);
			});
		});
	};

	let deletePin = (pinId, userToken) => {
		return $q((resolve, reject) => {
			$http.delete(`${FirebaseUrl}pins/${pinId}.json?auth=${userToken}`)
			.then((deletePinData) => {
				resolve(deletePinData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let deleteProjectPins = (projectId, userToken) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}pins.json?auth=${userToken}`)
			.then((allPinsData) => {
				let projectPinsIdArray = [];

				if (allPinsData.data === null) {
					console.log('no pins found for project', allPinsData.data);
					resolve(null);
				}

				Object.keys(allPinsData.data).forEach((key) => {
					if(allPinsData.data[key].project_id === projectId) {
						projectPinsIdArray.push(key);
					}
				});


				// console.log('project pins array', projectPinsIdArray);
				let pinsDeleteArray = projectPinsIdArray.map((pinId) => {
					return deletePin(pinId, userToken);
				});

				if (pinsDeleteArray === []) {
					console.log('no pins associated with project', pinsDeleteArray);
					resolve([]);
				}

				// console.log('pins delete array', pinsDeleteArray);
				return $q.all(pinsDeleteArray);
			})
			.then((dataFromDeletePins) => {
				resolve(dataFromDeletePins);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	return {createPin, getPins, getPin, deletePin, deleteProjectPins};

});