const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json('Unauthorized');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(403).json('Unauthorized');
  }
};

module.exports = verify;
