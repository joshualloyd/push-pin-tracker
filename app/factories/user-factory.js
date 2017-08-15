'use strict';

pushPinApp.factory("UserFactory", function($q, $http, FirebaseUrl, FBCreds) {

  var config = {
    apiKey: FBCreds.apiKey,
    authDomain: FBCreds.authDomain,
    storageBucket: FBCreds.storageBucket
  };

  firebase.initializeApp(config);

  let currentUser = null;

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

  let createUser = (userObj) => {
    return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
    .catch( (err) => {
      console.log("error creating user", err.message);
    });
  };

  let loginUser = (userObj) => {
    return $q( (resolve, reject) => {
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

  console.log("firebase", firebase );

  return {isAuthenticated, getUser, createUser, loginUser, logoutUser, modifyProfile};
});
