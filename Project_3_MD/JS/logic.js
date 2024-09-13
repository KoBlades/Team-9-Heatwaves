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
function fetchClimateData(cityName, lat, lng, startDate, endDate) {
    let apiUrl = `https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            if (data && data.daily && Array.isArray(data.daily.time) && Array.isArray(data.daily.temperature_2m_max)) {
                let temperaturesInCelsius = data.daily.temperature_2m_max;
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
                
                // Create heat map
                let heatArray = temperaturesInFahrenheit.map((temp, index) => [lat, lng, temp]);
                L.heatLayer(heatArray, { radius: 25, blur: 15 }).addTo(map);
                
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

// Handle button click to fetch data
document.getElementById("fetch-data").addEventListener("click", function() {
    let cityName = document.getElementById("city-search").value;
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;
    
    if (cityName && startDate && endDate) {
        getCoordinates(cityName)
            .then(coords => {
                map.setView([coords.lat, coords.lng], 10);
                fetchClimateData(cityName, coords.lat, coords.lng, startDate, endDate);
            })
            .catch(error => console.error("Error:", error));
    } else {
        console.error("Please fill in all fields.");
    }
});

