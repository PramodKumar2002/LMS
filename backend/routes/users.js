const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { listUsers, getUserById } = require('../controllers/userController');

router.get('/', protect, adminOnly, listUsers);
router.get('/:id', protect, adminOnly, getUserById);

module.exports = router;
