const express = require('express');
const router = express.Router();
const db = require('../database'); // Assuming a database connection module

// Enroll iris
router.post('/enroll', (req, res) => {
    const { personId, template, metadataJson } = req.body;
    try {
        const stmt = db.stmts.insertBiometric;
        stmt.run(personId, 'iris', template, metadataJson);
        res.status(201).json({ message: 'Iris enrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Enrollment failed' });
    }
});

// Verify iris
router.post('/verify', (req, res) => {
    const { personId, template } = req.body;
    try {
        const biometrics = db.stmts.getBiometricsByPersonId.all(personId);
        // Implement verification logic here (mock for now)
        const matchFound = biometrics.some(b => b.template === template);
        res.json({ match: matchFound });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;
