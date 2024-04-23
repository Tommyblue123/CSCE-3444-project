document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = 'Login page.html'; // Redirects user to login page
});

document.getElementById('joinButton').addEventListener('click', function() {
    window.location.href = 'User_Registration.html'; // Redirects user to login page
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');

    hamburger.addEventListener('click', function() {
        // Toggle the "active" class on the navigation menu
        navigation.classList.toggle('active');
    });
});

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

auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, show the profile picture
      document.querySelector('a > img.profile-pic').style.display = 'block';
    } else {
      // User is signed out, hide the profile picture
      document.querySelector('a > img.profile-pic').style.display = 'none';
    }
  });
