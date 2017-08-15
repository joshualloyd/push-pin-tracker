'use strict';

console.log('the ProfileCreateController loaded');

pushPinApp.controller("ProfileCreateController", function($scope, $window, $routeParams, UserFactory) {

	console.log('ProfileCreateController runs');

	$scope.user = UserFactory.getUser();
	$scope.userName = '';

	$scope.saveUserName = () => {
		UserFactory.modifyProfile($scope.userName)
		.then((successData) => {
			console.log('modifyProfile worked', successData);
		})
		.catch((err) => {
			console.log('modifyProfile worked', err);
			$window.location.href = '#!/projects/view';
		});
	};

});