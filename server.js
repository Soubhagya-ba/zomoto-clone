// ✅ 1. Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');  // <-- PostgreSQL client
const cors = require('cors');
const app = express();

// ✅ 2. CORS: allow only Netlify frontend
app.use(cors({
  origin: "https://rainbow-sunshine-4d0502.netlify.app/"
}));

app.use(express.json());

// ✅ 3. PostgreSQL: use environment variable for connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Required for Neon
  }
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err.stack);
    process.exit(1);
  }
  console.log('✅ Connected to PostgreSQL');
  release(); // release client back to the pool
});

// ✅ 4. POST endpoint to save location
app.post('/save-location', async (req, res) => {
  const { latitude, longitude, full_address } = req.body;

  if (!latitude || !longitude || !full_address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `INSERT INTO locations (latitude, longitude, full_address) VALUES ($1, $2, $3)`;
    await pool.query(query, [latitude, longitude, full_address]);

    res.json({ message: 'Location saved successfully!' });
  } catch (err) {
    console.error('❌ Insert error:', err);
    res.status(500).json({ error: 'Database insert error' });
  }
});

// ✅ 5. Dynamic port for Render
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
