const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const path = require('path');
// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// PostgreSQL pool setup - adjust connection details as needed
const pool = new Pool({
  user: 'postgres',  // Update with your PostgreSQL username
  host: 'localhost',
  database: 'Placemate',
  password: 'root',  // Updated with your PostgreSQL password
  port: 5432,
});

// Create users table if not exists
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  await pool.query(query);
};

createUsersTable().catch(err => console.error('Error creating users table:', err));

require('dotenv').config();

// Setup nodemailer transporter - replace with your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email from environment variable
    pass: process.env.EMAIL_PASS  // Password or app password from environment variable
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Signup successful.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Insert login time into user_sessions with name and email
    await pool.query(
      'INSERT INTO user_sessions (user_id, name, email, login_time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [user.id, user.name, user.email]
    );

    // Send login notification email
    const mailOptions = {
      from: 'your-email@gmail.com', // Replace with your email
      to: user.email,
      subject: 'Welcome to Placemate',
      text: `Hello ${user.name},\n\nYou are now a part of Placemate. Welcome aboard!\n\nIf this wasn't you, please contact support immediately.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending login notification email:', error);
      } else {
        console.log('Login notification email sent:', info.response);
      }
    });

    // Return user info except password
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/logout', async (req, res) => {
  const { email } = req.body;
  console.log('Logout API called with email:', email);
  if (!email) {
    console.log('Logout API error: No email provided');
    return res.status(400).json({ message: 'Please provide email.' });
  }

  try {
    // Find the latest session for the user with null logout_time
    const sessionResult = await pool.query(
      `SELECT us.id FROM user_sessions us
       JOIN users u ON us.user_id = u.id
       WHERE u.email = $1 AND us.logout_time IS NULL
       ORDER BY us.login_time DESC
       LIMIT 1`,
      [email]
    );

    if (sessionResult.rows.length === 0) {
      console.log('Logout API error: No active session found for user');
      return res.status(404).json({ message: 'No active session found for user.' });
    }

    const sessionId = sessionResult.rows[0].id;

    // Update logout_time to current timestamp
    await pool.query(
      'UPDATE user_sessions SET logout_time = CURRENT_TIMESTAMP WHERE id = $1',
      [sessionId]
    );

    console.log('Logout time updated for session id:', sessionId);
    res.json({ message: 'Logout time recorded successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Placemate backend listening at http://localhost:${port}`);
});
