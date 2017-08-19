'use strict';

pushPinApp.factory("UserFactory", function($q, $http, FirebaseUrl, FBCreds) {

  var config = {
    apiKey: FBCreds.apiKey,
    authDomain: FBCreds.authDomain,
    storageBucket: FBCreds.storageBucket
  };

  firebase.initializeApp(config);

  let currentUser = null;
  // let userToken = null;

  let isAuthenticated = function() {
    // console.log("isAuthenticated called");
    return new Promise( (resolve, reject) => {
      // console.log("firing onAuthStateChanged");
      firebase.auth().onAuthStateChanged(function(user) {
        // console.log("onAuthStateChanged finished");
        if (user) {
          console.log("user", user);
          currentUser = user.uid;

          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  let getUser = () => {
    return currentUser;
  };

  // let getUserToken = () => {
  //   return userToken;
  // };

  let createUser = (userObj) => {
    return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
    .catch( (err) => {
      console.log("error creating user", err.message);
    });
  };

  let loginUser = (userObj) => {
    return $q( (resolve, reject) => {
      console.log('userObj', userObj);
      firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
      .then( (user) => {
        currentUser = user.uid;
        resolve(user);
      })
      .catch( (err) => {
        console.log("error loggin in", err.message);
      });
    });
  };

  let logoutUser = () => {
    return firebase.auth().signOut()
    .catch( (err) => {
      console.log("error loggin' out, man", err.message);
    });
  };

  let modifyProfile = (userName) => {
    return $q((resolve, reject) => {
      var user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: userName
        // photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function() {
        let displayName = user.displayName;
        resolve(displayName);
      }).catch(function(error) {
        reject(error);
      });
    });
  };

  let getUserToken = () => {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;

      user.getIdToken()
      .then((tokenString) => {
        // console.log(tokenString);
        resolve(tokenString);
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

  let createUserInfo = (userId, userType, userToken) => {
    return $q((resolve, reject) => {
      // get user info from firebase
      let currentUser = firebase.auth().currentUser;
      // empty client
      let newUser = {};
      // set the variables
      if (currentUser !== null) {
        newUser.name = currentUser.displayName;
        newUser.email = currentUser.email;
        newUser.uid = currentUser.uid;
        newUser.type = userType;
      }

      $http.post(`${FirebaseUrl}users.json?auth=${userToken}`, angular.toJson(newUser))
      .then((newUserData) => {
        resolve(newUserData);
      })
      .catch((err) => {
        reject(err);
      });

    });
  };

  let getClients = (userToken) => {
    return $q((resolve, reject) => {
      $http.get(`${FirebaseUrl}users.json?auth=${userToken}`)
      .then((allUsersData) => {
        let allUsersArray = [];

        Object.keys(allUsersData.data).forEach((key) => {
          allUsersData.data[key].id = key;
          allUsersArray.push(allUsersData.data[key]);
        });

        let allClientsArray = allUsersArray.filter((user) => {
          return user.type === 'client';
        });

        resolve(allClientsArray);
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

  let getUserInfoByUid = (userUid, userToken) => {
    return $q((resolve, reject) => {
      $http.get(`${FirebaseUrl}users.json?auth=${userToken}`)
      .then((dataFromGetUserInfo) => {
        console.log('dataFromGetUserInfo', dataFromGetUserInfo);
        console.log('userUid', userUid);

        let userInfoObj;

        // for(var user in dataFromGetUserInfo.data) {
        //   if (user.uid === userUid) {
        //     userInfoObj = user;
        //   }
        // }

        Object.keys(dataFromGetUserInfo.data).forEach((key) => {
          if (dataFromGetUserInfo.data[key].uid === userUid) {
            userInfoObj = dataFromGetUserInfo.data[key];
          }
        });

        console.log('userInfoObj', userInfoObj);

        resolve(userInfoObj);
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

  console.log("firebase", firebase);

  return {isAuthenticated, getUser, createUser, loginUser, logoutUser, modifyProfile, getClients, createUserInfo, getUserInfoByUid, getUserToken};
});
