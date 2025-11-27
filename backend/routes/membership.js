const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addMembership, updateMembership } = require('../controllers/membershipController');

router.post('/add', protect, addMembership);
router.put('/update', protect, updateMembership);

module.exports = router;
