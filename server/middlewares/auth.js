import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_default_secret'; // store securely in .env

export const authenticateSystem = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.system = decoded; // attach decoded machine_id, hostname etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
