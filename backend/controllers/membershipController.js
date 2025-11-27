const Membership = require('../models/Membership');
const User = require('../models/User');

exports.addMembership = async (req, res) => {
  const { durationMonths } = req.body; // 6,12,24
  if(![6,12,24].includes(durationMonths)) return res.status(400).json({ message: 'Invalid duration' });
  try {
    const membership = await Membership.create({ user: req.user._id, durationMonths });
    req.user.membership = membership._id;
    await req.user.save();
    res.json(membership);
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMembership = async (req, res) => {
  const { action, durationMonths } = req.body; // action: extend or cancel
  try {
    const membership = await Membership.findOne({ user: req.user._id });
    if(!membership) return res.status(404).json({ message: 'No membership' });

    if(action === 'cancel') {
      membership.active = false;
      await membership.save();
      req.user.membership = null;
      await req.user.save();
      return res.json({ message: 'Cancelled' });
    } else if(action === 'extend' && [6,12,24].includes(durationMonths)) {
      // extend startDate to now and set duration
      membership.startDate = new Date();
      membership.durationMonths = durationMonths;
      membership.active = true;
      await membership.save();
      return res.json(membership);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
};
