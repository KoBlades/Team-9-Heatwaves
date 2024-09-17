---Create the table with the combined data from both CSVs 

CREATE TABLE climate_data (
    City TEXT,
    Date DATE,
    Max_Temperature_F NUMERIC
);

---Check if the table was created property 
SELECT * FROM climate_data;

---Remove the decimals and round up 
ALTER TABLE climate_data
ALTER COLUMN Max_Temperature_F TYPE INTEGER
USING ROUND(Max_Temperature_F);

---Test out if the queries are working properly 
SELECT * FROM climate_data WHERE City = 'Los Angeles';

SELECT * FROM climate_data WHERE City = 'San Francisco';

