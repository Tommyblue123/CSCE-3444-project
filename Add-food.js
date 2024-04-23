//Firebase
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


// Listen to the form submission
document.getElementById('food-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
    addFoodItem();
});


function addFoodItem() {
    // Ensure the user is signed in before proceeding
    const user = auth.currentUser;
    if (!user) {
        console.log('User is not signed in.');
        // Redirect to login page or show a message asking the user to sign in
        window.location.href = 'Login page.html';
        return; // Exit the function early
    }

    // Gather input values here
    const foodItemData = {
        name: document.getElementById('foodName').value.trim(),
        quantity: document.getElementById('quantity-Available').value.trim(),
        BBD: document.getElementById('BBD').value.trim(),
        food_type: document.getElementById('food-type').value.trim(),
        packaging: document.getElementById('packaging-info').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    // Mapping of food types to icons
    const foodTypeIcons = {
        fruits: '🍎',
        vegetables: '🥦',
        dairy: '🧀',
        grains: '🍞',
        meals: '🍲'
    };
    // Use the icons in your food item cards
    const foodTypeIcon = foodTypeIcons[document.getElementById('food-type').value.toLowerCase()] || ''; // Fallback to an empty string if no match

    // Check if any required field is empty
    if (!foodItemData.name || !foodItemData.quantity || !foodItemData.BBD || !foodItemData.food_type) {
        alert('Please fill in all required fields.');
        return;
    }

    addFoodItemToDatabase(foodItemData);

    const foodItemContainer = document.createElement('div');
    foodItemContainer.classList.add('food-item');

    foodItemContainer.innerHTML = `
        <h3>${foodTypeIcon} ${document.getElementById('foodName').value}</h3>
        <p>Quantity Available: ${document.getElementById('quantity-Available').value}</p>
        <p>Best Before Date: ${document.getElementById('BBD').value}</p>
        <p>Type of Food: ${document.getElementById('food-type').value}</p>
        <p>Packaging Information: ${document.getElementById('packaging-info').value}</p>
        <p>${document.getElementById('description').value}</p>
    `;

    document.getElementById('foodItemsContainer').appendChild(foodItemContainer);

    // Clear form fields after successful addition
    document.getElementById('foodName').value = '';
    document.getElementById('quantity-Available').value = '';
    document.getElementById('BBD').value = '';
    document.getElementById('food-type').value = '';
    document.getElementById('packaging-info').value = '';
    document.getElementById('description').value = '';

    document.getElementById('food-form').reset();
}




// This function will save the food item data under the user's unique ID
function addFoodItemToDatabase(foodItemData) {
    const userId = auth.currentUser.uid; // Get the current user's UID
    const newFoodItemRef = database.ref('users/' + userId + '/foodItems').push();

    newFoodItemRef.set(foodItemData, function(error) {
        if (error) {
            console.error("Data could not be saved." + error);
        } else {
            console.log("Data saved successfully.");
            // Display a success message or handle a successful save accordingly
            alert('Food item added successfully!');
        }
    });
}


