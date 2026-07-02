const jwt = require("jsonwebtoken");

// In a real app this would come from an environment variable / secret manager.
const JWT_SECRET = process.env.JWT_SECRET || "trainee-qa-dev-secret";
const TOKEN_TTL = "1h";

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

// Express middleware: rejects the request unless a valid Bearer token is present.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { signToken, requireAuth };
