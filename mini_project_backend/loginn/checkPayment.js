const Payment = require("./payment_model");

const checkPayment = async (req, res, next) => {
  const userId = req.user.id;

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const payment = await Payment.findOne({
    userId,
    month,
    year,
    status: "paid",
  });

  if (!payment) {
    return res.status(403).json({
      msg: "❌ Pay to access this page",
    });
  }

  next();
};

module.exports = checkPayment;