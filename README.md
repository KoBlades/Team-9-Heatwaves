# How Climate Change Fuels Wildfires
### by Mariem Diaz, Stacey Walker, and Johnathan Tran

This project aims to explore the relationship between rising temperatures and wildfires in California. Using a user-driven dashboard built with Plotly and an interactive map built with Leaflet, users can compare maximum temperatures across two different years for five major California cities and visualize wildfires across the state from 1985 to 2022. The goal is to identify trends and investigate potential correlations between climate patterns and wildfire occurrences.

## Project Overview
Climate change has significantly impacted the state of California, leading to hotter summers and more frequent and intense wildfires. This project focuses on analyzing historical data of daily maximum temperatures in major cities and comparing it to wildfire data over a 30-year period to better understand these trends.

We utilized large APIs to extract relevant datasets, which were transformed into DataFrames using Pandas. These datasets were then saved as CSV files and stored in PostgreSQL for efficient future analysis and manipulation. Using Python we analysed the data via data frames and maps. Using JavaScript we created user driven visualizations which played a major role in telling the story of this correlation between rising temperatures and wildfires. 

![California Wildfires](https://github.com/KoBlades/Team-9-Heatwaves/blob/main/Project_3_MD/Wildfires/Images/california_fires.png)


### Key Features:

Interactive Dashboard: Built with Plotly, users can:

- Select from five major California cities.
- Compare maximum temperatures between any two selected years.
- Analyze temperature trends over the past 20 years.

![Dashboard](https://github.com/KoBlades/Team-9-Heatwaves/blob/main/Project_3_MD/Wildfires/Images/temperature_dashboard.png)

![Comparing Temperatures](https://github.com/KoBlades/Team-9-Heatwaves/blob/main/Project_3_MD/Wildfires/Images/newplot.png)

Interactive Wildfire Map: Developed using the Leaflet library in JavaScript:

- Displays the locations and sizes of wildfires across California from 1985 to 2022.
- Allows users to zoom in and out to explore wildfire activity by region and time period and acre size.
- Visualizing the number of wildfires and total acres burned over the past 30 years.
- Exploring any potential correlations between temperature rises and wildfire activity.

![User Driven Visualization](https://github.com/KoBlades/Team-9-Heatwaves/blob/main/Project_3_MD/Wildfires/Images/image.png)

![Wildfire Acres](https://github.com/KoBlades/Team-9-Heatwaves/blob/main/Project_3_MD/Wildfires/Images/acres_fires.png)
### Programs and Libraries Used
- Python: Backend processing and data manipulation.
- JavaScript: Powering the front-end dashboard and interactive maps.
- Pandas: Python library for data analysis and manipulation.
- Plotly & Plotly Express: Used for dynamic, interactive visualizations.
- Leaflet: A JavaScript library for creating interactive maps with wildfire data.
- GeoPandas: Python library for working with geospatial data.
- Papa Parse: A JavaScript library for parsing CSV files.
- PostgreSQL: Database used for storing and querying climate and wildfire data.

### Data Sources
Climate Data API: Historical daily maximum temperature data for five major California cities.

Wildfire Data API: Historical wildfire records including fire name, year, total acres burned, and geographical coordinates.

Wildfire data is derived from official sources, spanning the past 30 years.
Climate data encompasses temperature records from the past 20 years.

## Conclusion 
Conclusion
Over the past three decades, year-round temperatures have steadily risen, with the most significant increases occurring in late summer and early fall. These higher temperatures have contributed to severe droughts, creating conditions where wildfires can spread more rapidly across dry landscapes. While the number of fires fluctuates from year to year and shows no strong correlation with heatwaves alone, the number of acres burned per fire has noticeably increased, partially due to the intensifying heatwaves. This suggests that while heatwaves may not directly cause more fires, they contribute to the severity and spread of the fires that do occur.

## Final Notes

This project was completed with the help stackOverFlow, ChatGPT, and past class activities. 
You can view the presentation [Google Slides](https://docs.google.com/presentation/d/1nUe0JtWUv8RW2lQ-kVaNUPQ6VA8ewDgQfYOqchsrsbc/edit?usp=sharing)
