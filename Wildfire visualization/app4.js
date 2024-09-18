// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // California

// Add OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a custom fire icon
var fireIcon = L.icon({
    iconUrl: 'icons/fire.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Object to store wildfires by year
var wildfiresByYear = {};

// Initialize currentLayer to null
var currentLayer = null;

// Define a function to get the fire icon size based on acres burned
function getFireIcon(acres) {
    let iconSize;
    
    if (acres < 100) {
        iconSize = [5, 5];  // Very small icon
    } else if (acres < 5000) {
        iconSize = [10, 10];  // Small icon
    } else if (acres < 20000) {
        iconSize = [15, 15];  // Medium icon
    } else if (acres < 40000) {
        iconSize = [30, 30];  // Large icon
    } else if (acres < 80000) {
        iconSize = [40, 40];  // Large icon
    } else if (acres < 160000) {
        iconSize = [60, 60];  // Large icon
    } else {
        iconSize = [90, 90];  // Very large icon
    }

    return L.icon({
        iconUrl: 'icons/fire.png',
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]],
        popupAnchor: [0, -iconSize[1]]
    });
}

// Function to process and group wildfires by year
function plotWildfires(data) {
    data.forEach(function(row) {
        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longitude);
        const fireName = row.FIRE_NAME;
        const year = row.YEAR;
        const acres = row.ACRES;

        console.log('Parsed Year:', year); // Log year to verify it's correct

        // Check if the year already exists in the wildfiresByYear object
        if (!wildfiresByYear[year]) {
            wildfiresByYear[year] = [];
        }

        // Add marker data to the corresponding year
        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], { icon: getFireIcon(acres) }) // Use dynamic icon based on fire size
                .bindPopup(`<b>${fireName} (${year})</b><br>Acres Burned: ${acres}`);
            wildfiresByYear[year].push(marker);
        }
    });

    // Plot markers for the initial year (1985 by default)
    updateMapForYear(1985);
}

// Function to display wildfires for the selected year
function updateMapForYear(year) {
    // Clear existing markers
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    // Check if data exists for the selected year
    if (wildfiresByYear[year]) {
        // Create a layer group for the selected year
        currentLayer = L.layerGroup(wildfiresByYear[year]).addTo(map);
    } else {
        console.log(`No data available for year: ${year}`);
    }
}

// Function to handle dropdown selection and update the map
function updateYearFromDropdown(selectedYear) {
    updateMapForYear(selectedYear);
}

// Function to handle slider and update the year
function updateYearFromSlider(selectedYear) {
    const yearDisplay = document.getElementById("selectedYear");
    yearDisplay.textContent = selectedYear;
    updateMapForYear(selectedYear);
}

// Load CSV file from local directory and process it
fetch('data/wildfire_1985_2000.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                console.log(results.data); // Log parsed CSV data
                plotWildfires(results.data);
            }
        });
    })
    .catch(error => console.error('Error loading the CSV file:', error));

fetch('data/wildfire_2021_2022.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                console.log(results.data); // Log parsed CSV data
                plotWildfires(results.data);
            }
        });
    })
    .catch(error => console.error('Error loading the CSV file:', error));
