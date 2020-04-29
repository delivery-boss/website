   

  //Handles the signout-button in the side panel when pressed
    document.getElementById('signout-button').addEventListener('click', ()=>{
      firebase.auth().signOut();
      location.reload();
    })
  /**
     * Handles the sign in button press.
     */
    var globalEmail;
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
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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
            // document.querySelector('.login-screen-close').click();
            document.querySelector('.hide-user-box').style.display = 'none';
            document.querySelector('.hide-password-box').style.display = 'none';
            document.querySelector('.hide-signin-box').style.display = 'none';
            document.querySelector('.hide-signup-box').style.display = 'none';
            document.querySelector('.login-screen-title').textContent = 'You are logged in';
            document.querySelector('#proceed-app').style.display = 'block';
            document.querySelector('#proceed-app').addEventListener('click', ()=>{
              location.reload();
            })
            // document.querySelector('#account-button').addEventListener('click', ()=>{
            //   if(document.querySelector('#riderName').value==='' || document.querySelector('#phone').value===''){
            //     app.dialog.confirm('Could not fetch your detilas. Try again?', function () {
            //       location.reload();
            //     });
            //   }
            // })

           

              // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            //document.getElementById("e-mail").innerHTML = email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            

            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as';
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            document.getElementById('quickstart-account-details').textContent = email;
            globalEmail = document.getElementById('quickstart-account-details').textContent;
            document.getElementById('signin-button').disabled = true;
            document.getElementById('signin-button').style.color = 'gray';
            document.getElementById('signout-button').disabled = false;
            document.getElementById('signout-button').style.color = 'red';
            
            if (!emailVerified) {
              document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
          } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.querySelector('#proceed-app').style.display = 'none';
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