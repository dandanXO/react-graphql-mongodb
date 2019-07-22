const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; // Authorization: bearer xxxxx
  if (!token) {
    req.isAuth = false;
    return next();
  }
  let decodeToken = '';
  try {
    decodeToken = jwt.verify(token, 'somesueprsecretkey');
  } catch (e) {
    req.isAuth = false;
    return next();
  }
  if (!decodeToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodeToken.userId;
  return next();
};
