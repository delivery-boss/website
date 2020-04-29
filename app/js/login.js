//Handles the signout-button in the side panel when pressed
  document.getElementById('signout-button').addEventListener('click', ()=>{
    firebase.auth().signOut();
    location.reload();
  })
/**
   * Handles the sign in button press.
   */
var globalEmail;
// Create full-layout notification to inform the user upon successfull submission
var submitNotification = app.notification.create({
  icon: '<i class="icon material-icons">add_alert</i>',
  title: 'DeliveryBOSS',
  //titleRightText: 'now',
  subtitle: 'Submission Notice',
  text: 'Hello, your submission was successfull!',
  closeTimeout: 3000,
});
var onlineNotification = app.notification.create({
  icon: '<i class="icon material-icons">phonelink</i>',
  title: 'DeliveryBOSS',
  //titleRightText: 'now',
  subtitle: 'Notice',
  text: 'You are currently online',
  closeTimeout: 3000,
});
var offlineNotification = app.notification.create({
  icon: '<i class="icon material-icons">phonelink_off</i>',
  title: 'DeliveryBOSS',
  //titleRightText: 'now',
  subtitle: 'Notice',
  text: 'You are currently offline',
  closeTimeout: 3000,
});
  function toggleSignIn() {
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      document.getElementById('quickstart-sign-in').disabled = true;
    }

    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Create user with email and pass.
      // [START createwithemail]
      firebase.auth().createUserWithEmailAndPassword(email, password).then(
        //Directs user to setup his profile information
        function(){
              //Update user info into Firebase Firestore
              db.collection("app").doc(email).set({
                ridername: document.querySelector("#updateRiderName").value,
                phone: document.querySelector("#updatePhone").value,
                location: document.querySelector("#updateCompanyLocation").value,
                plate: document.querySelector("#updatePlate").value,
                id: document.querySelector("#updateID").value,
                payment: document.querySelector("#updatePayment").value,
                delivery: document.querySelector("#updateDelivery").value,
                verified: "No",
                duedate: "",
                lat: "",
                lng: ""
            }).then(function() {
              console.log('Success');
            }).catch(function() {
              console.log('Error');
            })
        }

        ).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END createwithemail]
    }

    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }

    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    //Create a global email value
    function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
          //Check if user is new or not
          if(user.displayName!==null){
            document.querySelector('#proceed-app').style.display = 'block';
            document.querySelector('.login-screen-title').textContent = 'Welcome! ' + user.displayName;
          }else{
            document.querySelector('#proceed-app').style.display = 'none';
            document.querySelector('#set-profile').style.display = 'block';
            document.querySelector('.login-screen-title').textContent = 'Thanks for signing up!';
          }
          document.querySelector('.hide-user-box').style.display = 'none';
          document.querySelector('.hide-password-box').style.display = 'none';
          document.querySelector('.hide-signin-box').style.display = 'none';
          document.querySelector('.hide-signup-box').style.display = 'none';
          document.querySelector('#proceed-app').addEventListener('click', ()=>{
            location.reload();
          })



          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var phoneNumber = user.phoneNumber;
          //document.getElementById("e-mail").innerHTML = email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;

          console.log("Name: " + displayName);
          console.log("Email: " + email);
          console.log("Phone:" + phoneNumber);
          console.log("URL: " + photoURL);
          console.log(JSON.stringify(user));

          globalEmail = email;
          document.querySelector("#setProfileImg").src = photoURL;
          document.querySelector("#viewProfileImg").src = photoURL;
          document.querySelector(".viewRiderName").textContent = displayName;
          // document.querySelector(".viewPhone").textContent = '+233' + phoneNumber;


          /*=== View an expanded Profile Photo ===*/
          var myProfilePic = app.photoBrowser.create({
            photos : [
                photoURL,
            ],
            theme: 'dark'
          });
          //Open photo browser on click
          $$('.pb-profile-pic').on('click', function () {
              myProfilePic.open();
          });



        var user = firebase.auth().currentUser;


        //Get users GPS after loging in or signing up
        function getLocation() {
          if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition);
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
        }
        
        getLocation();
        
        function showPosition(position) {
          document.querySelector('#setLat').value = position.coords.latitude;
          document.querySelector('#setLng').value = position.coords.longitude;
          console.log('Lat: ' + position.coords.latitude);
          console.log('Lon: ' + position.coords.longitude);
        }
        
        //When the location throws an error
        function onLocationError(e) {
          alert(e.message);
        }


        //Get a reference to the firebase document and update the riders status
        function checkUserState(){
          db.collection("app").doc(globalEmail).get().then(function(doc) {
            if (doc.exists) {
                    document.querySelector("#updateRiderName").value = doc.data().ridername;
                    document.querySelector("#updatePhone").value = doc.data().phone;
                    document.querySelector("#updateCompanyLocation").value = doc.data().location;
                    document.querySelector("#updatePlate").value = doc.data().plate;
                    document.querySelector("#updateID").value = doc.data().id;
                    document.querySelector("#updatePayment").value = doc.data().payment;
                    document.querySelector("#updateDelivery").value = doc.data().delivery;
                    document.querySelector(".account-state").value = doc.data().verified;
                    document.querySelector("#due-date").value = doc.data().duedate;
                    document.querySelector("#setIdImg").src = doc.data().idURL;

                    /*=== View an expanded ID Photo ===*/
                    var myIDPic = app.photoBrowser.create({
                      photos : [
                        document.querySelector("#setIdImg").src,
                      ],
                      theme: 'dark'
                    });
                    //Open photo browser on click
                    $$('.pb-ID-pic').on('click', function () {
                        myIDPic.open();
                    });

                    document.querySelector("#accountForm").addEventListener("submit", evt => {
                      evt.preventDefault();
                      //Update user info into Firebase Authentication
                      user.updateProfile({
                        displayName: document.querySelector("#updateRiderName").value,
                        phoneNumber: document.querySelector("#updatePhone").value
                      }).then(function() {
                        submitNotification.open();
                      }).catch(function(error) {
                        // An error happened.
                        console.log('Error');
                      });
    

                      //Update user info into Firebase Firestore
                      db.collection("app").doc(globalEmail).update({
                          ridername: document.querySelector("#updateRiderName").value,
                          phone: document.querySelector("#updatePhone").value,
                          location: document.querySelector("#updateCompanyLocation").value,
                          plate: document.querySelector("#updatePlate").value,
                          id: document.querySelector("#updateID").value,
                          payment: document.querySelector("#updatePayment").value,
                          delivery: document.querySelector("#updateDelivery").value,
                          lat: document.querySelector("#updateLat").value,
                          lng: document.querySelector("#updateLng").value,
                      }).then(function() {
                        submitNotification.open();
                        setTimeout(location.reload(), 5000)                       
                      }).catch(function() {
                        console.log('Error');
                      })
                    });

                    /*Update riders location on the server if the rider's status is opened
                       and his account has been verified and his location is not set to Moving*/                   
                    if(doc.data().status==='open' && doc.data().verified==='Yes'){
                        document.querySelector('#riderStatusClosed').style.display = 'none';
                        document.querySelector('#riderStatusOpen').style.display = 'block';
                        onlineNotification.open();
                        if(doc.data().location==='Moving'){
                          //Update riders location on firestore every 1 minute
                          setInterval(function() { 
                            return db.collection('app').doc(globalEmail).update({
                                    lat: document.querySelector('#setLat').value,
                                    lng: document.querySelector('#setLng').value
                                })
                                .then(function() {
                                    console.log("Document successfully updated!");
                                })
                                .catch(function(error) {
                                    // The document probably doesn't exist.
                                    console.error("Error connecting to server: ", error);
                                });
                  
                            }, 10000); // 60 * 1000 milsec
                        }
                    }else if (doc.data().status==='closed'){
                        document.querySelector('#riderStatusOpen').style.display = 'none';
                        document.querySelector('#riderStatusClosed').style.display = 'block';
                        offlineNotification.open();
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

        }
        setInterval(checkUserState(), 300);

          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as';
          document.getElementById('quickstart-sign-in').textContent = 'Sign out';
          document.getElementById('quickstart-account-details').textContent = email;
          document.getElementById('signin-button').disabled = true;
          document.getElementById('signin-button').style.color = "#519822";
          document.getElementById('signout-button').disabled = false;
          document.getElementById('signout-button').style.color = 'white';
          
          if (!emailVerified) {
            document.getElementById('quickstart-verify-email').disabled = false;
          }
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          document.querySelector('#proceed-app').style.display = 'none';
          document.querySelector('#set-profile').style.display = 'none';
          document.querySelector('#signin-button').click();
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          document.getElementById('quickstart-account-details').textContent = '';
          document.getElementById('signin-button').disabled = false;
          document.getElementById('signin-button').style.color = 'red';
          document.getElementById('signout-button').disabled = true;
          document.getElementById('signout-button').style.color = 'gray';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]

      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }

    window.onload = function() {
      initApp();
    };