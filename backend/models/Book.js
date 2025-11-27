const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  serialNo: { type: String, required: true, unique: true },
  isMovie: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
