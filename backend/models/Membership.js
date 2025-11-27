const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, default: Date.now },
  durationMonths: { type: Number, default: 6 }, // 6, 12, 24
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Membership', membershipSchema);
