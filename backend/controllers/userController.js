import { addUser, fetchUsers, loginUser, generateAuthToken, getUserById } from "../services/userServices.js";
import { authenticateToken } from "../middleware/auth.js";

export async function getUsers(req, res) {
  try {
    const users = await fetchUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
}

export async function signup(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await addUser(firstName, lastName, email, password);
    // Generate JWT token
    const token = generateAuthToken(user._id);
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (err) {
    if (err.message === 'User with this email already exists') {
      return res.status(409).json({ 
        success: false, 
        error: "User with this email already exists" 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to create user" 
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = generateAuthToken(user._id);
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: "Failed to login" 
    });
  } 
}

export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch profile" 
    });
  }
}