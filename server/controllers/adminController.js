const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ message: 'Username and role are required' });
  }

  try {
    const newUser = await userService.createUser(username, role);
    res.status(201).json({ message: 'User created successfully', user: { username: newUser.username, password: newUser.generatedPassword, role: newUser.role } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};