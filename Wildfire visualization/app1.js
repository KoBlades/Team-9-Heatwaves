// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // California

// Add OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a custom fire icon
var fireIcon = L.icon({
    iconUrl: 'icons/fire.png', // Path to your fire icon
    iconSize: [32, 32], // Size of the icon (width, height)
    iconAnchor: [16, 32], // Point of the icon that will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});

// Function to process and plot CSV data
function plotWildfires(data) {
    data.forEach(function(row) {
        // Extract latitude and longitude
        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longitude);
        
        // Extract other data like fire name and acres burned
        const fireName = row.FIRE_NAME;
        const year = row.YEAR;
        const acres = row.ACRES;

        // Add a marker with the custom fire icon
        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], { icon: fireIcon }).addTo(map);
            marker.bindPopup(`<b>${fireName} (${year})</b><br>Acres Burned: ${acres}`);
        }
    });
}

// Load CSV file from local directory and process it
fetch('data/wildfire_data.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                plotWildfires(results.data);
            }
        });
    })
    .catch(error => console.error('Error loading the CSV file:', error));
