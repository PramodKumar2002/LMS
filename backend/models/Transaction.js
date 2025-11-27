const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  actualReturnDate: { type: Date },
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
