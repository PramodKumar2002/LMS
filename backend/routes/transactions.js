const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { issueBook, returnBook, listUserTransactions } = require('../controllers/transactionController');

router.post('/issue', protect, issueBook);
router.post('/return', protect, returnBook);
router.get('/my', protect, listUserTransactions);

module.exports = router;
