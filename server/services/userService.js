const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const loadUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing users.json:', err);
  }
};

exports.createUser = async (username, role) => {
  const users = loadUsers();
  const saltRounds = 10;
  const generatedPassword = Math.random().toString(36).substring(2, 10); // Simple random password
  const passwordHash = await bcrypt.hash(generatedPassword, saltRounds);

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password_hash: passwordHash,
    role,
  };

  users.push(newUser);
  saveUsers(users);

  return { username, generatedPassword, role };
};

exports.verifyCredentials = async (username, password) => {
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      return { id: user.id, username: user.username, role: user.role };
    }
  }
  return null;
};

exports.getAllUsers = () => {
  const users = loadUsers();
  return users.map(u => ({ id: u.id, username: u.username, role: u.role, totalOrders: u.totalOrders }));
};

exports.deleteUser = (id) => {
  let users = loadUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== parseInt(id));

  if (users.length === initialLength) {
    throw new Error('User not found');
  }

  saveUsers(users);
};

exports.updateUser = (id, { role }) => {
  let users = loadUsers();
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex].role = role;
  saveUsers(users);

  return users[userIndex];
};

exports.addOrderIdToUser = (userId, orderId) => {
  let users = loadUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex].orderIds.push(orderId);
  users[userIndex].totalOrders = users[userIndex].orderIds.length;
  saveUsers(users);
};