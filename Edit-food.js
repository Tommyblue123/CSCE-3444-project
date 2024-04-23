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

// Check if a user is signed in and fetch/display food items
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        fetchAndDisplayFoodItems();
    } else {
        console.log('No user signed in.');
    }
});

function fetchAndDisplayFoodItems() {
    const userId = auth.currentUser.uid;
    const userFoodItemsRef = database.ref(`users/${userId}/foodItems`);

    userFoodItemsRef.on('value', snapshot => {
        const foodItemsContainer = document.getElementById('foodItemsDisplayContainer');
        foodItemsContainer.innerHTML = '';

        snapshot.forEach(childSnapshot => {
            const foodItem = childSnapshot.val();
            const foodItemKey = childSnapshot.key;
            displayFoodItem(foodItem, foodItemsContainer, foodItemKey);
        });
    });
}

function displayFoodItem(foodItem, container, foodItemKey) {
    const foodItemElement = document.createElement('div');
    foodItemElement.classList.add('food-item-container');

    foodItemElement.innerHTML = `
        <h3>${foodItem.name}</h3>
        <p>Quantity Available: ${foodItem.quantity}</p>
        <p>Best Before Date: ${foodItem.BBD}</p>
        <p>Type of Food: ${foodItem.food_type}</p>
        <p>Packaging Information: ${foodItem.packaging}</p>
        <p>Description: ${foodItem.description}</p>
        <button class="edit-btn" onclick="openEditModal('${foodItemKey}')">Edit</button>
        <button class="delete-btn" onclick="deleteFoodItem('${foodItemKey}')">Delete</button>
    `;

    container.appendChild(foodItemElement);
}

function openEditModal(foodItemId) {
    const modal = document.getElementById('editModal');
    const closeSpan = document.querySelector('.close');

    database.ref(`users/${auth.currentUser.uid}/foodItems/${foodItemId}`).once('value', snapshot => {
        const foodItem = snapshot.val();
        // Populate the form with existing food item data
        document.getElementById('edit-food-item-id').value = foodItemId;
        document.getElementById('foodName').value = foodItem.name;
        document.getElementById('quantity-Available').value = foodItem.quantity;
        document.getElementById('BBD').value = foodItem.BBD;
        document.getElementById('food-type').value = foodItem.food_type;
        document.getElementById('packaging-info').value = foodItem.packaging;
        document.getElementById('description').value = foodItem.description;

        modal.style.display = 'block';
    });

    closeSpan.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => event.target === modal ? modal.style.display = 'none' : '';
}

function deleteFoodItem(foodItemId) {
    const itemRef = database.ref(`users/${auth.currentUser.uid}/foodItems/${foodItemId}`);
    itemRef.remove()
        .then(() => console.log('Item removed successfully'))
        .catch(error => console.error('Remove failed:', error.message));
}

document.getElementById('edit-food-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const foodItemId = document.getElementById('edit-food-item-id').value;
    const updatedFoodItem = {
        name: document.getElementById('foodName').value.trim(),
        quantity: document.getElementById('quantity-Available').value.trim(),
        BBD: document.getElementById('BBD').value,
        food_type: document.getElementById('food-type').value.trim(),
        packaging: document.getElementById('packaging-info').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    const itemRef = database.ref(`users/${auth.currentUser.uid}/foodItems/${foodItemId}`);
    itemRef.update(updatedFoodItem)
        .then(() => {
            console.log("Data updated successfully");
            document.getElementById('editModal').style.display = 'none';
            fetchAndDisplayFoodItems();
        })
        .catch(error => console.error("Error updating data: ", error));
});
