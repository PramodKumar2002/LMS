const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  const { title, author, serialNo, isMovie, remarks } = req.body;
  if(!title || !author || !serialNo) return res.status(400).json({ message: 'Missing fields' });
  try {
    const book = await Book.create({ title, author, serialNo, isMovie: !!isMovie, remarks });
    res.json(book);
  } catch(err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!book) return res.status(404).json({ message: 'Not found' });
    res.json(book);
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchBooks = async (req, res) => {
  const q = (req.query.q || '').trim();
  // simple search by title/author/serial
  const regex = new RegExp(q, 'i');
  const books = q
    ? await Book.find({ $or: [{ title: regex }, { author: regex }, { serialNo: regex }] })
    : await Book.find().limit(100); // return a reasonable default set when no query
  res.json(books);
};

exports.getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if(!book) return res.status(404).json({ message: 'Not found' });
  res.json(book);
};
