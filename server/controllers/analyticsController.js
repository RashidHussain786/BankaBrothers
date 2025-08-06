const analyticsService = require('../services/analyticsService');

exports.getSalesOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const salesData = await analyticsService.getSalesOverview(startDate, endDate);
    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error('Error fetching sales overview:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const topProducts = await analyticsService.getTopSellingProducts(limit, startDate, endDate);
    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.getUserPerformance = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const userPerformance = await analyticsService.getUserPerformance(limit, startDate, endDate);
    res.status(200).json({
      success: true,
      data: userPerformance,
    });
  } catch (error) {
    console.error('Error fetching user performance:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.getCustomerInsights = async (req, res) => {
  try {
    const { limit, startDate, endDate } = req.query;
    const customerInsights = await analyticsService.getCustomerInsights(limit, startDate, endDate);
    res.status(200).json({
      success: true,
      data: customerInsights,
    });
  } catch (error) {
    console.error('Error fetching customer insights:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};