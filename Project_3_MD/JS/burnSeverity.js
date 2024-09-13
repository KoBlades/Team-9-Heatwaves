// Initialize the map
const map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on California

// Add a tile layer (satellite view) from Mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/satellite-v9',
    attribution: '© Mapbox © OpenStreetMap',
    accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN', // Replace with your Mapbox access token
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// URL to fetch the GeoJSON data
const geoJsonUrl = "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_FireOccurrenceAndPerimeter_01/MapServer/9/query?where=1%3D1&outFields=*&outSR=4326&f=json";

// Function to process and display wildfire data as a heat map and geographical layer
function processWildfireData(data) {
    if (data && data.features) {  // Ensure 'features' exists in the fetched data
        // Filter wildfires that occurred between 1984 and the present
        const filteredData = data.features.filter(feature => {
            const year = new Date(feature.attributes.FIRE_YEAR).getFullYear(); // Use appropriate field for the year
            return year >= 1984;
        });

        console.log("Filtered wildfire data:", filteredData);

        // Extract coordinates for heat map
        const heatPoints = filteredData.map(feature => {
            const coordinates = feature.geometry?.rings[0][0]; // Assumes rings for polygon geometry
            const lat = coordinates[1];
            const lng = coordinates[0];
            return [lat, lng, 1]; // 1 is intensity of the point (change this as needed)
        });

        // Create the heat map layer
        const heatLayer = L.heatLayer(heatPoints, {
            radius: 20, // Radius of each "heat" point
            blur: 15,   // Blurring of the points
            maxZoom: 11
        }).addTo(map);

        // Create a GeoJSON layer to display wildfire perimeters
        L.geoJSON(filteredData, {
            onEachFeature: (feature, layer) => {
                const fireYear = new Date(feature.attributes.FIRE_YEAR).getFullYear();
                layer.bindPopup(`Fire Name: ${feature.attributes.FIRE_NAME}<br>Year: ${fireYear}`);
            },
            style: {
                color: "red",
                weight: 1,
                opacity: 0.7
            }
        }).addTo(map);
    } else {
        console.error("GeoJSON data does not have the expected 'features' property.");
    }
}

// Fetch the GeoJSON data
fetch(geoJsonUrl)
    .then(response => response.json())
    .then(data => {
        console.log("Fetched GeoJSON data:", data);  // Log the data to inspect its structure
        processWildfireData(data);
    })
    .catch(error => console.error("Error fetching the GeoJSON data:", error));
