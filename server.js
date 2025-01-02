const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8200; // Server port
const DATA_FILE = path.join(__dirname, 'table-data.json');

// Serve static files
app.use(express.static(__dirname));

// Parse JSON request body
app.use(express.json());

// Load table data
app.get('/table-data', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        res.json(data);
    } else {
        // Initialize with empty data
        const emptyData = Array.from({ length: 15 }, () => Array(13).fill(["", "white"]));
        fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData), 'utf-8');
        res.json(emptyData);
    }
});

// Save table data
app.post('/save-table', (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            res.status(400).send('Invalid data format.');
            return;
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body), 'utf-8');
        res.sendStatus(200);
    } catch (err) {
        console.error('Error saving table data:', err);
        res.sendStatus(500);
    }
});

// Clear table data
app.post('/clear-data', (req, res) => {
    try {
        const emptyData = Array.from({ length: 15 }, () => Array(13).fill(["", "white"]));
        fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData), 'utf-8');
        res.sendStatus(200);
    } catch (err) {
        console.error('Error clearing table data:', err);
        res.sendStatus(500);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
