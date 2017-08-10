'use strict';

pushPinApp.factory('PinFactory', function($q, $http, FirebaseUrl) {

	let createPin = (newPinObj) => {
		return $q((resolve, reject) => {
			$http.post(`${FirebaseUrl}pins.json`, angular.toJson(newPinObj))
			.then((newPinData) => {
				resolve(newPinData);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let getPin = (pinId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}pins/${pinId}.json`)
			.then((pinData) => {
				resolve(pinData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let getPins = (projectId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}pins.json`)
			.then((pinsData) => {
				let pinsArray = [];
				let pinsObjects = pinsData.data;
				Object.keys(pinsObjects).forEach((key) => {
					pinsObjects[key].id = key;
					pinsArray.push(pinsObjects[key]);
				});
				let filteredPinsArray = pinsArray.filter((pin) => {
					return pin.project_id === projectId;
				});
				resolve(filteredPinsArray);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let deletePin = (pinId) => {
		return $q((resolve, reject) => {
			$http.delete(`${FirebaseUrl}pins/${pinId}.json`)
			.then((deletePinData) => {
				resolve(deletePinData.data);
			})
			.catch((err) => {
				reject(err);
			});
		});
	};

	let deleteProjectPins = (projectId) => {
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}pins.json`)
			.then((allPinsData) => {
				let projectPinsIdArray = [];
				Object.keys(allPinsData.data).forEach((key) => {
					if(allPinsData.data[key].project_id === projectId) {
						projectPinsIdArray.push(key);
					}
				});
				// console.log('project pins array', projectPinsIdArray);
				let pinsDeleteArray = projectPinsIdArray.map((pinId) => {
					return deletePin(pinId);
				});
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