const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User'); // added

function calculateFine(returnDate, actualReturnDate) {
  if(!actualReturnDate) return 0;
  const lateMs = actualReturnDate - returnDate;
  if(lateMs <= 0) return 0;
  const daysLate = Math.ceil(lateMs / (1000*60*60*24));
  return daysLate * 5; // ₹5 per day
}

exports.issueBook = async (req, res) => {
  const { bookId, returnDate, email } = req.body;
  if(!bookId) return res.status(400).json({ message: 'Book id required' });
  if(!returnDate) return res.status(400).json({ message: 'Return date required' });

  try {
    const book = await Book.findById(bookId);
    if(!book) return res.status(404).json({ message: 'Book not found' });

    // check availability if model uses availableCount or available flag
    if (book.availableCount != null && book.availableCount <= 0) {
      return res.status(400).json({ message: 'No available copies' });
    }
    if (book.available === false) {
      return res.status(400).json({ message: 'Selected copy is not available' });
    }

    // determine target user: admin may provide 'email' to issue to another user
    let targetUserId = req.user._id;
    if (email && req.user?.isAdmin) {
      const target = await User.findOne({ email: email.trim().toLowerCase() });
      if (!target) return res.status(404).json({ message: 'Target user not found' });
      targetUserId = target._id;
    }

    // create transaction
    const tx = await Transaction.create({
      user: targetUserId,
      book: book._id,
      issueDate: new Date(),
      returnDate: new Date(returnDate),
      fineAmount: 0,
      finePaid: false
    });

    // decrement available count if present
    if (book.availableCount != null) {
      book.availableCount = Math.max(0, book.availableCount - 1);
      await book.save();
    } else if (typeof book.available === 'boolean') {
      // optional: if only boolean present, mark not available
      book.available = false;
      await book.save();
    }

    res.json({ message: 'Book issued', transaction: tx });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err: err.message });
  }
};

exports.returnBook = async (req, res) => {
  const { transactionId, actualReturnDate, finePaid, remarks } = req.body;
  if(!transactionId) return res.status(400).json({ message: 'transactionId required' });
  try {
    const tx = await Transaction.findById(transactionId).populate('book');
    if(!tx) return res.status(404).json({ message: 'Transaction not found' });
    if(tx.actualReturnDate) return res.status(400).json({ message: 'Already returned' });

    const actual = actualReturnDate ? new Date(actualReturnDate) : new Date();
    const fine = calculateFine(tx.returnDate, actual);

    // if there is a fine and not marked paid, block completion
    if(fine > 0 && !finePaid) {
      // return payable fine to frontend
      return res.status(400).json({ message: 'Fine pending', fine });
    }

    tx.actualReturnDate = actual;
    tx.fineAmount = fine;
    tx.finePaid = fine === 0 ? true : !!finePaid;
    tx.remarks = remarks || '';
    await tx.save();

    const book = await Book.findById(tx.book._id);
    book.available = true;
    await book.save();

    res.json({ message: 'Returned', fine });
  } catch(err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.listUserTransactions = async (req, res) => {
  const txs = await Transaction.find({ user: req.user._id }).populate('book');
  res.json(txs);
};
