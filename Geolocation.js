document.getElementById('search-input').addEventListener('input', function() {
    // Show the clear button if there's text in the input
    const clearButton = document.getElementById('clear-search');
    if (this.value.length > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
});

document.getElementById('clear-search').addEventListener('click', function() {
    // Clear the search input and hide the clear button
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    this.style.display = 'none';
    searchInput.focus(); // Optionally, bring focus back to the input
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



//map
var map, service, infowindow;
var markers = [];

function initMap() {
    // Try HTML5 geolocation to center map on user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 12
            });
            service = new google.maps.places.PlacesService(map);
            infowindow = new google.maps.InfoWindow();

            //addCategoryButtons(); // This will render category buttons on the page
            initAutocomplete();
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }

    document.getElementById('center-map').addEventListener('click', function() {
        // Check if the Geolocation API is supported
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // Get the user's current position
                var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                
                // Center the map on the user's location
                map.setCenter(userLocation);

                // Optional: Add a marker at the user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location'
                });

            }, function() {
                handleLocationError(true, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, map.getCenter());
        }
    });
}

function searchPlaces() {
    var input = document.getElementById('search-input').value.trim();

    if (!input) {
        alert('Please enter a ZIP code or state.');
        return;
    }

    var request = {
        query: input + ' food bank',
        fields: ['name', 'geometry', 'formatted_address', 'place_id', 'opening_hours', 'formatted_phone_number']
    };

    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            createMarkers(results);
            if (results.length > 0) {
                // Adjust map view to the first result
                map.setCenter(results[0].geometry.location);
                map.setZoom(12);
            }
        } else {
            alert('Search failed: ' + status);
        }
    });
}


function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place) {
        if (!place.geometry) return;

        var marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
        });
        // Assume 'formatted_phone_number' might not be available
        var phone_number = place.formatted_phone_number ? 'Phone: ' + place.formatted_phone_number + '<br>' : '';

        google.maps.event.addListener(marker, 'click', (function(place) {
            return function() {
                var contentString = '<div><strong>' + place.name + '</strong><br>' +
                                    'Address: ' + place.formatted_address + '<br>' +
                                    phone_number +
                                    '<a href="https://www.google.com/maps/dir/?api=1&destination=' +
                                    encodeURIComponent(place.name + ', ' + place.formatted_address) +
                                    '" target="_blank">Get Directions</a></div>';
                infowindow.setContent(contentString);
                infowindow.open(map, this);
            }
        })(place));

        markers.push(marker);
        bounds.extend(place.geometry.location);
    });

    map.fitBounds(bounds);
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 12
    });
}



function initAutocomplete() {
    // Create the search box and link it to the UI element
    var input = document.getElementById('search-input');
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Specify the data fields you want from the places API
    autocomplete.setFields(['name', 'geometry', 'place_id']);

    // Set the map bounds based on the selected place
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        searchPlaces(place.name); // Perform a search based on the autocomplete selection
    });
}


//FQA
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const icon = this.querySelector('ion-icon');
        const isExpanded = answer.style.display === 'block';
        
        // Toggle display of the answer
        answer.style.display = isExpanded ? 'none' : 'block';

        // Toggle icon based on the expanded state
        icon.setAttribute('name', isExpanded ? 'add-circle-outline' : 'remove-circle-outline');

        // Update aria-expanded attribute for accessibility
        this.setAttribute('aria-expanded', !isExpanded);
    });
});

