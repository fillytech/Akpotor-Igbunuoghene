const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../database'); // Assuming a database connection module

// Register route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    
    try {
        const stmt = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');
        stmt.run(email, passwordHash, 'officer');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (user && await bcrypt.compare(password, user.password_hash)) {
            req.session.userId = user.id;
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (req.session.userId) {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
        res.json(user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

module.exports = router;
