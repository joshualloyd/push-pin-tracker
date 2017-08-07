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

	let getPin = () => {};

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

	return {createPin, getPins};

});