module.exports = (req, res, next) => {
  if (req.user) {
    return res.status(403).json({
      statusClarification: 'action is not allowed for authenticated users'
    });
  }
  return next();
};
