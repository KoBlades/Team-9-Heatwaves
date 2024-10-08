// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // California

// Add OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add scale control to the map
L.control.scale({
    position: 'bottomleft',
    metric: false,
    imperial: true
}).addTo(map);

// Object to store wildfires by year
var wildfiresByYear = {};

// Initialize currentLayer to null
var currentMarkersLayer = L.layerGroup();
var currentCirclesLayer = L.layerGroup();
var HeatwavesLayer = L.layerGroup();

// Add both layers to the map initially, but they will be empty at first
currentMarkersLayer.addTo(map);
currentCirclesLayer.addTo(map);
HeatwavesLayer.addTo(map);

// Add a control to toggle the fire icons and fire circles layers
var overlayMaps = {
    "Fire Icons": currentMarkersLayer,
    "Fire Size Circles": currentCirclesLayer,
    "Heatwaves": HeatwavesLayer
};

L.control.layers(null, overlayMaps).addTo(map);

// Define a function to get the fire icon size based on acres burned
function getFireIcon(acres) {
    let iconSize;

    if (acres < 100) {
        iconSize = [10, 10];  // Very small icon
    } else if (acres < 5000) {
        iconSize = [5, 5];  // Small icon
    } else if (acres < 20000) {
        iconSize = [10, 10];  // Medium icon
    } else if (acres < 40000) {
        iconSize = [15, 15];  // Large icon
    } else if (acres < 80000) {
        iconSize = [20, 20];  // Large icon
    } else if (acres < 160000) {
        iconSize = [25, 25];  // Large icon
    } else {
        iconSize = [30, 30];  // Very large icon
    }

    return L.icon({
        iconUrl: 'icons/fire.png',
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]],
        popupAnchor: [0, -iconSize[1]]
    });
}

// Function to calculate circle radius based on acres
function getRadius(acres) {
    return Math.sqrt(acres) * 33;  // Adjust multiplier for scaling
}

// Function to calculate circle opacity based on acres
function getOpacity(acres) {
    if (acres > 1000) {
        return 0.8;
    } else if (acres > 500) {
        return 0.6;
    } else {
        return 0.4;
    }
}

// Function to process and group wildfires by year, adding markers and circles
function plotWildfires(data) {
    data.forEach(function(row) {
        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longitude);
        const fireName = row.FIRE_NAME;
        const year = row.YEAR;
        const acres = row.ACRES;

        // Check if the year already exists in the wildfiresByYear object
        if (!wildfiresByYear[year]) {
            wildfiresByYear[year] = { markers: [], circles: [] };
        }

        // Add markers and circles to the corresponding year
        if (!isNaN(lat) && !isNaN(lng)) {
            // Add marker with dynamic icon based on fire size
            const marker = L.marker([lat, lng], { icon: getFireIcon(acres) })
                .bindPopup(`<b>${fireName} (${year})</b><br>Acres Burned: ${acres}`);

            // Add circle representing fire size
            const circle = L.circle([lat, lng], {
                color: 'orange',
                fillColor: 'orange',
                fillOpacity: getOpacity(acres),
                radius: getRadius(acres)
            }).bindPopup(`<b>${fireName} (${year})</b><br>Acres Burned: ${acres}`);

            // Push both marker and circle into the year's array
            wildfiresByYear[year].markers.push(marker);
            wildfiresByYear[year].circles.push(circle);
        }
    });

    // Plot markers and circles for the initial year (1985 by default)
    updateMapForYear(1985);
}

// Function to display wildfires for the selected year
function updateMapForYear(year) {
    // Clear existing markers and circles for wildfires, but do not clear heatwaves
    currentMarkersLayer.clearLayers();
    currentCirclesLayer.clearLayers();
    
    // Check if data exists for the selected year
    if (wildfiresByYear[year]) {
        // Add markers and circles to the map
        wildfiresByYear[year].markers.forEach(marker => marker.addTo(currentMarkersLayer));
        wildfiresByYear[year].circles.forEach(circle => circle.addTo(currentCirclesLayer));
    } else {
        console.log(`No wildfire data available for year: ${year}`);
    }
}

// Function to handle slider and update the year
function updateYearFromSlider(selectedYear) {
    const yearDisplay = document.getElementById("selectedYear");
    yearDisplay.textContent = selectedYear;  // Update the displayed year
    updateMapForYear(selectedYear);  // Update the map with the selected year
    updateHeatwavePopup(selectedYear);  // Update heatwave popup for the selected year
}

// Initialize a layer for heatwaves
var nevadaCircle = L.circle([41.2633, -118.1745], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 0.5,
    radius: 50000 // Constant size for the location
}).addTo(HeatwavesLayer);

// Object to store heatwaves by year
var heatwavesByYear = {};

// Function to process and group heatwaves by year
function processHeatwaveData(data) {
    data.forEach(function(row) {
        const year = row.Year;  // Adjust this based on the actual year column in your CSV
        const heatwaveCount = row.Heatwaves

        // // Ensure the heatwave count is valid and accumulate it
        if (!heatwavesByYear[year]) {
            heatwavesByYear[year] = 0;
        }
        heatwavesByYear[year] += heatwaveCount;  // Increment the count of heatwaves for this year
    });
}

// Function to update the popup with the number of heatwaves for the selected year
function updateHeatwavePopup(year) {
    const heatwaveCount = heatwavesByYear[year] || 0;  // Get the count or 0 if no data for the year
    nevadaCircle.bindPopup(`<b>Year: ${year}</b><br>Number of Heatwaves: ${heatwaveCount}`).openPopup();
}


// Load wildfire CSV file from local directory and process it
fetch('data/wildfire_1985_2000.csv')
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

fetch('data/wildfire_2021_2022.csv')
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

// Load the Nevada heatwave data and process it
fetch('data/Nevada_heatwave_data.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                processHeatwaveData(results.data);
                updateHeatwavePopup(1985);  // Show data for the default year (e.g., 1985) when the map loads
            }
        });
    })
    .catch(error => console.error('Error loading the heatwave CSV file:', error));

// Event listener for the slider to update the year
document.getElementById('yearSlider').addEventListener('input', function(e) {
    const selectedYear = e.target.value;
    updateYearFromSlider(selectedYear);
});
