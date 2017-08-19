'use strict';

console.log('the ProfileCreateController loaded');

pushPinApp.controller("ProfileCreateController", function($scope, $window, $routeParams, UserFactory) {

	console.log('ProfileCreateController runs');

	let userToken = null;

	$scope.user = UserFactory.getUser();
	$scope.userName = '';

	$scope.saveUserName = () => {

		UserFactory.getUserToken()
		.then((userTokenString) => {
			userToken = userTokenString;
			return UserFactory.modifyProfile($scope.userName);
		})
		.then((successData) => {
			console.log('modifyProfile worked', successData);
			// if ($scope.userType === 'client') {
			// 	return UserFactory.createClient($scope.user.uid);
			// } else if ($scope.userType === 'designer') {
			// 	return UserFactory.createDesigner($scope.user.uid);
			// } else {
			// 	console.log('user type not selected', $scope.userType);
			// }
			return UserFactory.createUserInfo($scope.user.uid, $scope.userType, userToken);
		})
		.then((newUserData) => {
			console.log('new user created', newUserData);
			$window.location.href = '#!/projects/view';
		})
		.catch((err) => {
			console.log('modifyProfile had an issue', err);
			$window.location.href = '#!/';
		});
	};

});