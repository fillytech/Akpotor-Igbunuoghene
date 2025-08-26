const express = require('express');
const authRoutes = require('./auth');
const fingerprintRoutes = require('./fingerprint');
const faceRoutes = require('./face');
const irisRoutes = require('./iris');
const dnaRoutes = require('./dna');

const router = express.Router();

// Use the routes
router.use('/api/auth', authRoutes);
router.use('/api/fingerprint', fingerprintRoutes);
router.use('/api/face', faceRoutes);
router.use('/api/iris', irisRoutes);
router.use('/api/dna', dnaRoutes);

module.exports = router;
