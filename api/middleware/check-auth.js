const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const docoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = docoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth Failed'
    });
  }
};
