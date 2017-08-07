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

	let getPins = () => {};

	return {createPin};

});