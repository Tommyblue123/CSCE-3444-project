const firebaseConfig = {
    apiKey: "AIzaSyDPbAHL_gIa4CcpAFzFyyoO0L6SARl0fkE",
    authDomain: "a-food-waste-reduction-website.firebaseapp.com",
    databaseURL: "https://a-food-waste-reduction-website-default-rtdb.firebaseio.com",
    projectId: "a-food-waste-reduction-website",
    storageBucket: "a-food-waste-reduction-website.appspot.com",
    messagingSenderId: "243268644954",
    appId: "1:243268644954:web:93f7dae8a0731266af6863",
    measurementId: "G-EZQQCPDLDB"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database()


document.getElementById('LogOut-Button').addEventListener('click', function() {
    auth.signOut().then(() => {
        console.log('User logged out');

        alert('You have successfully Logged out!!')
        // Redirect to index after successful logout
        window.location.href = 'index.html';
    })
    .catch((error) => {
        // Handle errors here, such as displaying an error message
        console.error('Logout Failed', error);
    });
});


auth.onAuthStateChanged(function(user) {
    if (user) {
        var uid = user.uid;
        database.ref('/users/' + uid).once('value').then((snapshot) => {
            var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
            document.getElementById('userNameDisplay').textContent = 'Welcome, ' + username + '!';
            console.log('welcom,' + username + '!');
        })
        .catch(error => {
            console.error('Error retrieving user data:', error);
        });
    } else {
        console.log('User is signed out')
    }
});

auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, show the profile picture
      document.querySelector('a > img.profile-pic').style.display = 'block';
    } else {
      // User is signed out, hide the profile picture
      document.querySelector('a > img.profile-pic').style.display = 'none';
    }
  });