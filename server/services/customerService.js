const prisma = require('../config/prisma');

// Helper function to convert string to camelCase and remove spaces
const toCamelCase = (str) => {
  if (!str) return null;
  return str.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); }).replace(/\s/g, '').replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};

exports.createCustomer = async (customerDetails) => {
  const { name, mobile, address, shopName } = customerDetails;

  if (!mobile) {
    throw new Error('Customer mobile number is required.');
  }

  // Check if a customer with this mobile number already exists
  const existingCustomer = await prisma.customer.findUnique({
    where: { mobile },
  });

  if (existingCustomer) {
    throw new Error('A customer with this mobile number already exists.');
  }

  const customer = await prisma.customer.create({
    data: {
      name: name || 'Unknown Customer',
      mobile,
      address: address || null,
      shopName: shopName ? toCamelCase(shopName) : null,
    },
  });

  return customer;
};

exports.getAllCustomers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const customers = await prisma.customer.findMany({
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' }, // Order by name for consistent pagination
  });

  const totalCount = await prisma.customer.count();

  return { customers, totalCount };
};

exports.updateCustomer = async (customerId, customerDetails) => {
  if (customerDetails.shopName) {
    customerDetails.shopName = toCamelCase(customerDetails.shopName);
  }
  return prisma.customer.update({
    where: { id: parseInt(customerId) },
    data: customerDetails,
  });
};

exports.deleteCustomer = async (customerId) => {
  const customerIdNum = parseInt(customerId);

  // Check if the customer has any associated orders
  const associatedOrders = await prisma.order.count({
    where: { customerId: customerIdNum },
  });

  if (associatedOrders > 0) {
    throw new Error('Cannot delete customer: Customer has associated orders.');
  }

  return prisma.customer.delete({
    where: { id: customerIdNum },
  });
};
