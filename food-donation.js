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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Fetch and display food items from all users
function fetchAndDisplayAllFoodItems() {
    const allFoodItemsRef = database.ref('users');

    allFoodItemsRef.on('value', snapshot => {
        const foodItemsContainer = document.getElementById('food-cards-container');
        foodItemsContainer.innerHTML = '';  // Clear existing items

        snapshot.forEach(userSnapshot => {
            const userName = userSnapshot.val().name; // Assuming there's a 'name' field under each user node
            userSnapshot.child('foodItems').forEach(childSnapshot => {
                const foodItem = childSnapshot.val();
                const foodItemKey = childSnapshot.key;
                displayFoodItem(foodItem, foodItemsContainer, foodItemKey, userName); // Pass userName to display function
            });
        });
    });
}

function displayFoodItem(foodItem, container, foodItemKey, userName) {
    const foodItemElement = document.createElement('div');
    foodItemElement.classList.add('food-card');

    foodItemElement.innerHTML = `
        <div class="food-info">
            <h3 class="food-title">${foodItem.name}</h3> 
            <p>Quantity Available: ${foodItem.quantity}</p>
            <p>Best Before Date: ${foodItem.BBD}</p>
            <p>Type of Food: ${foodItem.food_type}</p>
            <p>Packaging Information: ${foodItem.packaging}</p>
            <p>Description: ${foodItem.description}</p>
            <h4>Donated by ${userName}</h4> <!-- Display user name here -->
        </div>
    `;

    container.appendChild(foodItemElement);
}

// Check if a user is signed in and fetch/display food items
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        fetchAndDisplayAllFoodItems();  // Changed function call
        document.querySelector('a > img.profile-pic').style.display = 'block';
    } else {
        console.log('No user signed in.');
        document.querySelector('a > img.profile-pic').style.display = 'none';
    }
});


function searchByName() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
    const usersRef = database.ref('users');
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    usersRef.once('value', snapshot => {
        let found = false;
        snapshot.forEach(userSnapshot => {
            const foodItems = userSnapshot.child('foodItems');
            foodItems.forEach(itemSnapshot => {
                const foodItem = itemSnapshot.val();
                if(foodItem.name.toLowerCase().includes(searchValue)) {
                    found = true;
                    displaySearchResult(foodItem, resultsContainer);
                }
            });
        });
        if (!found) {
            resultsContainer.innerHTML = `<p>No results found for "${searchValue}"</p>`;
        }
    });
}

function displaySearchResult(foodItem, container) {
    const element = document.createElement('div');
    element.classList.add('search-result');
    element.innerHTML = `
        <h3>${foodItem.name}</h3>
        <p>Quantity Available: ${foodItem.quantity}</p>
        <p>Best Before Date: ${foodItem.BBD}</p>
        <p>Type of Food: ${foodItem.food_type}</p>
        <p>Packaging Information: ${foodItem.packaging}</p>
        <p>Description: ${foodItem.description}</p>
    `;
    container.appendChild(element);
}




document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = 'User_Registration.html'; // Redirects user to login page
});

