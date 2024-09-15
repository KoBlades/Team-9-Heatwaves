const fs = require('fs');
const pgp = require('pg-promise')();

const db = pgp({
    user: 'postgres',
    host: 'localhost',
    database: 'climate_change',
    password: 'postgres',
    port: 5432
});

async function exportData() {
    try {
        const data = await db.any('SELECT * FROM climate_data');
        fs.writeFileSync('climate_data.json', JSON.stringify(data, null, 2));
        console.log('Data successfully exported to climate_data.json');
    } catch (err) {
        console.error('Error exporting data:', err);
    } finally {
        pgp.end(); // Close the database connection
    }
}

exportData();
