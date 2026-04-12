const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No authentication token, authorization denied.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token format is invalid, authorization denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_interviewer_super_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = auth;
