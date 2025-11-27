const User = require('../models/User');

exports.listUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash').populate('membership');
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash').populate('membership');
  if(!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};
