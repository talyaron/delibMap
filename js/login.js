var provider = new firebase.auth.GoogleAuthProvider();
var userObject;

//check if user is signed in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("user",user.displayName,"loged in");

    userObject = user;
    $("#login").hide();
  } else {
    console.log("user is loge out")
    $("#login").show();
  }
});

//Google login
function login(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    userObject = result.user;
    console.log(user)
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

//logout
function logout(){
  firebase.auth().signOut();
}
