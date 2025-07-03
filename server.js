const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Update with your DB credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',     // ✅ Replace with your MySQL password
  database: 'tomato'      // ✅ Replace with your database name
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL');
});

// POST endpoint to save location
app.post('/save-location', (req, res) => {
  const { latitude, longitude, full_address } = req.body;

  if (!latitude || !longitude || !full_address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `INSERT INTO locations (latitude, longitude, full_address) VALUES (?, ?, ?)`;
  db.query(query, [latitude, longitude, full_address], (err, result) => {
    if (err) {
      console.error('❌ Insert error:', err);
      return res.status(500).json({ error: 'Database insert error' });
    }

    res.json({ message: 'Location saved successfully!' });
  });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
