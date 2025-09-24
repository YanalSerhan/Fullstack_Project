import validator from 'validator';
import xss from 'xss';

// Sanitize and validate input data
export const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body (safe to overwrite)
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query (mutate instead of overwrite)
    if (req.query && typeof req.query === "object") {
      for (const key in req.query) {
        req.query[key] =
          typeof req.query[key] === "object"
            ? sanitizeObject(req.query[key])
            : sanitizeValue(req.query[key]);
      }
    }

    // Sanitize params (mutate instead of overwrite)
    if (req.params && typeof req.params === "object") {
      for (const key in req.params) {
        req.params[key] =
          typeof req.params[key] === "object"
            ? sanitizeObject(req.params[key])
            : sanitizeValue(req.params[key]);
      }
    }

    next();
  } catch (error) {
    console.error("SanitizeInput Error:", error);
    return res.status(400).json({
      success: false,
      error: "Invalid input data",
    });
  }
};


// Recursively sanitize object properties
function sanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' ? sanitizeObject(item) : sanitizeValue(item)
    );
  }

  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = typeof value === 'object' ? sanitizeObject(value) : sanitizeValue(value);
    }
    return sanitized;
  }

  return sanitizeValue(obj);
}

// Sanitize individual values
function sanitizeValue(value) {
  try {
    if (typeof value === "string") {
      return xss(value, {
        whiteList: {}, // remove all HTML tags
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
      }).trim();
    }
    return value;
  } catch (err) {
    console.error("sanitizeValue error:", err, "with value:", value);
    return value; // fallback instead of throwing
  }
}

// Validate user registration data
export const validateUserRegistration = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = [];

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    errors.push('All fields are required. ');
  }

  // Validate email format
  if (email && !validator.isEmail(email)) {
    errors.push('Invalid email format. ');
  }

  // Validate password strength
  if (password) {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long. ');
    }
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol. ');
    }
  }

  // Validate name fields
  if (firstName && (firstName.length < 2 || firstName.length > 50)) {
    errors.push('First name must be between 2 and 50 characters. ');
  }
  if (lastName && (lastName.length < 2 || lastName.length > 50)) {
    errors.push('Last name must be between 2 and 50 characters. ');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      error: errors 
    });
  }

  next();
};

// Validate SQL queries
export const validateSQLQuery = (req, res, next) => {
  const { sql } = req.body;
  const errors = [];

  if (!sql || typeof sql !== 'string') {
    errors.push('SQL query is required');
    return res.status(400).json({ success: false, errors });
  }

  // Check for dangerous SQL operations
  const dangerousPatterns = [
    /drop\s+table/gi,
    /delete\s+from/gi,
    /truncate\s+table/gi,
    /alter\s+table/gi,
    /create\s+table/gi,
    /drop\s+database/gi,
    /create\s+database/gi,
    /grant\s+/gi,
    /revoke\s+/gi,
    /insert\s+into/gi,
    /update\s+/gi
  ];

  const trimmedSQL = sql.trim().toLowerCase();
  
  // Allow only SELECT queries for safety
  if (!trimmedSQL.startsWith('select')) {
    errors.push('Only SELECT queries are allowed');
  }

  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sql)) {
      errors.push('This query contains potentially dangerous operations');
      break;
    }
  }

  // Check for suspicious patterns
  if (sql.includes('--') || sql.includes('/*') || sql.includes('*/')) {
    errors.push('Comments are not allowed in queries');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  next();
};
