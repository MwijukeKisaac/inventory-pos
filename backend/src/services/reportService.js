// Fetch sales from DB (example using MySQL or Mongo)
exports.getDailySales = async () => {
  return {
    totalSales: 850000,
    totalProfit: 210000,
    orders: 37,
  };
};

exports.getWeeklySales = async () => {
  return {
    totalSales: 4300000,
    totalProfit: 970000,
    orders: 198,
  };
};
