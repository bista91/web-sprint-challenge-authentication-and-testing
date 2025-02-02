const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../data/dbConfig.js');  // Assuming dbConfig.js is set up to use knex
const JWT_SECRET = process.env.JWT_SECRET || 'shh';  // Secret for JWT token

// Register Endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Ensure username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    // Check if the username already exists
    const existingUser = await db('users').where('username', username).first();
    if (existingUser) {
      return res.status(400).json({ message: "username taken" });
    }

    // Hash the password before saving to the database
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Save the new user to the database
    const [id] = await db('users').insert({ username, password: hashedPassword });

    // Return the newly created user (id, username, password)
    return res.status(201).json({ id, username, password: hashedPassword });
  } catch (err) {
    return res.status(500).json({ message: "Error creating user" });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Ensure username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    // Check if the user exists
    const user = await db('users').where('username', username).first();
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // Compare provided password with hashed password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return success message and token
    return res.status(200).json({
      message: `welcome, ${user.username}`,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
