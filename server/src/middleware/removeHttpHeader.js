const removeHttpHeader = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
};

module.exports = removeHttpHeader;
