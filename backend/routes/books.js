const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { addBook, updateBook, searchBooks, getBook } = require('../controllers/bookController');

router.get('/search', protect, searchBooks);
router.get('/:id', protect, getBook);
router.post('/', protect, adminOnly, addBook);
router.put('/:id', protect, adminOnly, updateBook);

module.exports = router;
