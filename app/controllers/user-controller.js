'use strict';

pushPinApp.controller("UserController", function($scope, $window, UserFactory) {

  $scope.account = {
    email: "",
    password: ""
  };

  $scope.register = () => {
    // TODO validate that user doesn't exist
    // console.log("you clicked register");
    UserFactory.createUser($scope.account)
    .then( (userData) => {
      console.log("New User!", userData.uid);
      let userId = userData.uid;
      $window.location.href = `#!/profiles/create/${userId}`;
      // $scope.login();
    });
  };

  $scope.login = () => {
    UserFactory.loginUser($scope.account)
    .then( (userData) => {
      console.log("userData", userData);
      $window.location.href = '#!/projects/view';
    });
  };

});
