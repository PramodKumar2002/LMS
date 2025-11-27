const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

function calculateFine(returnDate, actualReturnDate) {
  if(!actualReturnDate) return 0;
  const lateMs = actualReturnDate - returnDate;
  if(lateMs <= 0) return 0;
  const daysLate = Math.ceil(lateMs / (1000*60*60*24));
  return daysLate * 5; // ₹5 per day
}

exports.issueBook = async (req, res) => {
  const { bookId, returnDate } = req.body;
  if(!bookId) return res.status(400).json({ message: 'Book id required' });
  try {
    const book = await Book.findById(bookId);
    if(!book || !book.available) return res.status(400).json({ message: 'Book not available' });

    const issueDate = new Date();
    const defaultReturnDate = returnDate ? new Date(returnDate) : new Date(+issueDate + 15*24*60*60*1000);
    // ensure return date not earlier than issue or later than 15 days ahead if constraint needed - follow your rule: default 15 days, user may set earlier but not >15 days? We'll allow up to 15 days.
    const maxReturn = new Date(+issueDate + 15*24*60*60*1000);
    if(defaultReturnDate > maxReturn) defaultReturnDate.setTime(maxReturn.getTime());

    const tx = await Transaction.create({
      user: req.user._id,
      book: book._id,
      issueDate,
      returnDate: defaultReturnDate
    });
    book.available = false;
    await book.save();
    res.json(tx);
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
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
