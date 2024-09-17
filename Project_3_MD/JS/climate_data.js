let climateData = {};  // Store parsed CSV data

// Load the CSV and process data
Papa.parse('Wildfires/Output_Data/combined_climate_data.csv', {
    download: true,
    header: true,
    complete: function(results) {
        climateData = processDataByYearAndMonth(results.data);

        // Populate dropdowns
        populateYearDropdown(climateData);
        populateCityDropdown(climateData, Object.keys(climateData)[0]);

        // Enable and populate the second year dropdown
        const yearSelect = document.getElementById('year-select');
        const secondYearSelect = document.getElementById('second-year-select');
        secondYearSelect.disabled = false;
        populateYearDropdown(climateData, secondYearSelect);

        // Initial plot for the first year and city
        plotDataForYearAndCity(climateData, Object.keys(climateData)[0], Object.keys(climateData[Object.keys(climateData)[0]])[0]);

        // Add event listeners
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            populateCityDropdown(climateData, selectedYear);
            plotDataForYearAndCity(climateData, selectedYear, document.getElementById('city-select').value);
        });

        document.getElementById('city-select').addEventListener('change', function() {
            plotDataForYearAndCity(climateData, document.getElementById('year-select').value, this.value);
        });

        document.getElementById('compare-button').addEventListener('click', function() {
            compareYears(
                document.getElementById('year-select').value,
                document.getElementById('second-year-select').value,
                document.getElementById('city-select').value
            );
        });
    }
});

// Function to process data and group by year and month
function processDataByYearAndMonth(data) {
    const yearlyMonthData = {};

    data.forEach(row => {
        const date = new Date(row.Date);
        const year = date.getFullYear();
        const month = date.getMonth();  // 0-based month (0 = January, 11 = December)
        const city = row.City;
        const temperature = parseFloat(row["Max Temperature (F)"]);

        if (!yearlyMonthData[year]) {
            yearlyMonthData[year] = {};
        }

        if (!yearlyMonthData[year][month]) {
            yearlyMonthData[year][month] = {};
        }

        if (!yearlyMonthData[year][month][city]) {
            yearlyMonthData[year][month][city] = [];
        }

        yearlyMonthData[year][month][city].push(temperature);
    });

    // Calculate average temperature for each month
    Object.keys(yearlyMonthData).forEach(year => {
        Object.keys(yearlyMonthData[year]).forEach(month => {
            Object.keys(yearlyMonthData[year][month]).forEach(city => {
                const temperatures = yearlyMonthData[year][month][city];
                const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
                yearlyMonthData[year][month][city] = avgTemperature;
            });
        });
    });

    return yearlyMonthData;
}

// Function to populate year dropdown
function populateYearDropdown(data, selectElement = document.getElementById('year-select')) {
    const years = Object.keys(data).sort();

    selectElement.innerHTML = '';  // Clear previous options

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        selectElement.appendChild(option);
    });
}

// Function to populate city dropdown
function populateCityDropdown(data, year) {
    const citySelect = document.getElementById('city-select');
    const cities = Object.keys(data[year][Object.keys(data[year])[0]]);

    citySelect.innerHTML = '';  // Clear previous options

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.text = city;
        citySelect.appendChild(option);
    });
}

// Function to plot data for the selected year and city
function plotDataForYearAndCity(data, year, city) {
    const monthlyData = data[year];
    const months = Array.from({ length: 12 }, (_, i) => i);  // 0 to 11 for months
    const temperatures = months.map(month => monthlyData[month] ? monthlyData[month][city] || null : null);

    const trace = {
        x: months.map(month => new Date(year, month).toLocaleString('default', { month: 'short' })),
        y: temperatures,
        mode: 'lines+markers',
        type: 'scatter',
        name: city
    };

    const layout = {
        title: `Temperature Trend for ${city} in ${year}`,
        xaxis: { title: 'Month' },
        yaxis: { title: 'Max Temperature (F)' }
    };

    Plotly.newPlot('chart', [trace], layout);
}

// Function to compare data between two years
function compareYears(year1, year2, city) {
    const data1 = climateData[year1] || {};
    const data2 = climateData[year2] || {};

    const months = Array.from({ length: 12 }, (_, i) => i);  // 0 to 11 for months

    const trace1 = {
        x: months.map(month => new Date(year1, month).toLocaleString('default', { month: 'short' })),
        y: months.map(month => data1[month] ? data1[month][city] || null : null),
        mode: 'lines+markers',
        type: 'scatter',
        name: `${city} ${year1}`,
        line: { color: 'blue' }
    };

    const trace2 = {
        x: months.map(month => new Date(year2, month).toLocaleString('default', { month: 'short' })),
        y: months.map(month => data2[month] ? data2[month][city] || null : null),
        mode: 'lines+markers',
        type: 'scatter',
        name: `${city} ${year2}`,
        line: { color: 'red' }
    };

    const layout = {
        title: `Temperature Comparison for ${city}`,
        xaxis: { title: 'Month' },
        yaxis: { title: 'Max Temperature (F)' }
    };

    Plotly.newPlot('chart', [trace1, trace2], layout);
}





