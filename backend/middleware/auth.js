export function detectGuest(req, _res, next) {
  // אם יש כותרת X-Guest או טוקן אורח
  const isGuest = req.header("X-Guest") === "true";
  req.user = req.user || {};
  req.user.isGuest = !!isGuest;
  
  // Debug log to see what we're detecting
  console.log('detectGuest middleware - X-Guest header:', req.header("X-Guest"));
  console.log('detectGuest middleware - isGuest:', req.user.isGuest);
  
  next();
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    // Decode the base64 token to get user info
    const userInfo = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Set the user ID for the request (the backend expects req.user.id)
    req.user = {
      id: userInfo.id || userInfo._id || userInfo.userId
    };
    
    // Debug log to see what we're getting
    console.log('Auth middleware - userInfo:', userInfo);
    console.log('Auth middleware - req.user.id:', req.user.id);
    
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
}