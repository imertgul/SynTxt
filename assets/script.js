const electron = require('electron');
  const {
    ipcRenderer
  } = electron;
var firebaseConfig = {
  apiKey: "AIzaSyBtu0QiT7b7T1O2eBdGj5idS7F-mjAA8Pk",
  authDomain: "syntxt-10a1d.firebaseapp.com",
  databaseURL: "https://syntxt-10a1d.firebaseio.com",
  projectId: "syntxt-10a1d",
  storageBucket: "syntxt-10a1d.appspot.com",
  messagingSenderId: "728805023306",
  appId: "1:728805023306:web:7cac2b60b726bec76ed0b3",
  measurementId: "G-Y1KW1EZM23"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User just signed in.
        $('#footer').text('Welcome ' +user.email);
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
    } else {
      ipcRenderer.send('signOut', user);
    }
});


$('#upBtn').on("click", function () {
  var email = $('#email').val();
  var password = $('#password').val();
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
    var user = firebase.auth().currentUser;
    console.log("User created successfully with payload-", user);
    alert("Account created succesfully");
  }, function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
  });
});

$('#inBtn').on("click", function () {
  var email = $('#email').val();
  var password = $('#password').val();
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
    console.log(user);
    // console.log(firebase.auth().currentUser);    
    alert('Log in success!')
    ipcRenderer.send('signIn', user);
  }, function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
  });
});