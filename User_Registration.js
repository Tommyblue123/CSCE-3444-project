document.getElementById('closeButton').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirects user to login page
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

var SignUp_DB = firebase.database().ref("SignUp");

document.getElementById('sign-up-form').addEventListener('submit', submitSignUp);

function submitSignUp(e){
    e.preventDefault();

    var name = getElementVal('signup-name');
    var email = getElementVal('signup-email');
    var password = getElementVal('signup-password');
    var role = document.querySelector('input[name="userRole"]:checked').value;

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password may have been typed Incorrectly!!')
        return
    }
    if (validate_field(name) == false || validate_field(role) == false) {
        alert('One or More fields is missing some Information!!')
        return
    }


    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
        // Declare user varible
        var user = auth.currentUser

        // Add this user to firebase Database
        var database_ref = database.ref()

        // Create User data
        var user_data = {
            email : email,
            name  : name,
            role : role,
            last_login : Date.now()
        }

        database_ref.child('users/' + user.uid ).set(user_data)

        alert('User Created!!')


         // Redirect the user after successful signup
         window.location.href = 'User_Dashboard.html';

        

        // Optional: Log or handle success, such as redirecting the user
        console.log("User created and additional info stored.");
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        var error_code = error.code
        var error_message = error.message

        alert(error_message)
        // console.error("Error creating user:", error.message);
        // Optional: handle errors, such as displaying a message to the user
    });
}

const getElementVal = (id) => {
    return document.getElementById(id).value;
};

function validate_email(email) {
    expression = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (expression.test(email) == true){
        //email is good
        return true
    } else {
        // email is bad
        return bad
    }

}

function validate_password(password) {
    if (password < 6) {
        return false
    } else {
        return true 
    }
}

function validate_field(field) {
    if( field == null) {
        return false
    }

    if (field.length <= 0 ) {
        return false
    } else {
        return true
    }
}


