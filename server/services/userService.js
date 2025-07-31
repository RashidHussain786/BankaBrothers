const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma'); // Import the Prisma client

exports.createUser = async (username, role) => {
  const saltRounds = 10;
  const generatedPassword = Math.random().toString(36).substring(2, 10); // Simple random password
  const passwordHash = await bcrypt.hash(generatedPassword, saltRounds);

  const newUser = await prisma.user.create({
    data: {
      username,
      passwordHash,
      role,
    },
  });

  return { username: newUser.username, generatedPassword, role: newUser.role };
};

exports.verifyCredentials = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
      return { id: user.id, username: user.username, role: user.role };
    }
  }
  return null;
};

exports.getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip: offset,
    take: limit,
    include: {
      orders: true, // Include orders to calculate totalOrders
    },
    orderBy: { username: 'asc' }, // Order by username for consistent pagination
  });

  const totalCount = await prisma.user.count();

  const formattedUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    totalOrders: u.orders.length, // Calculate totalOrders from the included orders
  }));

  return { users: formattedUsers, totalCount };
};

exports.deleteUser = async (id) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error code for record not found
      throw new Error('User not found');
    }
    throw error;
  }
};

exports.updateUser = async (id, { role }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
    });
    return updatedUser;
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error code for record not found
      throw new Error('User not found');
    }
    throw error;
  }
};

// The addOrderIdToUser function is no longer needed as order association is handled via userId in the Order model.
// totalOrders will be computed by counting related orders.
// This function will be removed.
