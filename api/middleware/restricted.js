const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'shh';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  // Ensure a token is provided
  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "token invalid" });
    }

    // Attach decoded token to the request object
    req.decodedJwt = decoded;
    next();
  });
};
