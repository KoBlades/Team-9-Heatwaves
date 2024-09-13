// Initialize the map
let map = L.map("map", {
    center: [39.8283, -98.5795], // Default center (United States)
    zoom: 10
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Function to fetch climate data
function fetchClimateData(cityName, lat, lng) {
    let apiUrl = `https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lng}&start_date=2023-01-01&end_date=2023-12-31&daily=temperature_2m_max`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            if (data && data.daily && Array.isArray(data.daily.time) && Array.isArray(data.daily.temperature_2m_max)) {
                let temperaturesInCelsius = data.daily.temperature_2m_max;    // Convert temperatures to Fahrenheit
                let temperaturesInFahrenheit = temperaturesInCelsius.map(celsiusToFahrenheit);
                
                // Clear existing markers
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Add new marker with temperature data
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<b>Temperature Data</b><br><b>City:</b> ${cityName}<br><b>Max Temperature:</b> ${temperaturesInFahrenheit[0].toFixed(1)}°F`)
                    .openPopup();            
            } else {
                console.error("Expected data structure not found.");
            }
        })
        .catch(error => console.error("Error fetching climate data:", error));
}

// Function to get coordinates from city name
function getCoordinates(cityName) {
    let geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`;

    return fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                let lat = parseFloat(data[0].lat);
                let lng = parseFloat(data[0].lon);
                return { lat, lng };
            } else {
                throw new Error("City not found.");
            }
        });
}

// Handle search input
document.getElementById("city-search").addEventListener("change", function() {
    let cityName = this.value;
    
    if (cityName) {
        getCoordinates(cityName)
            .then(coords => {
                map.setView([coords.lat, coords.lng], 10);
                fetchClimateData(cityName, coords.lat, coords.lng);
            })
            .catch(error => console.error("Error:", error));
    }
});
