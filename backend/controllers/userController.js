import { addUser, fetchUsers, loginUser, changePassword, updateUserProfile, getUserById } from "../services/userServices.js";

// for password hashing
//import bcrypt from "bcrypt";


export async function getUsers(req, res) {
  const users = await fetchUsers();
  res.json(users);
}

export async function signup(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const user = await addUser(firstName, lastName, email, password);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    //console.log(req.body);
    res.status(500).json({ error: "Failed to signup" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Normalize response to what frontend expects
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to login" });
  } 
}

export async function changeUserPassword(req, res) {
  try {
    const { currentPassword, newPassword, userId } = req.body;

    // Debug log to see what we're getting
    console.log('changeUserPassword - req.user:', req.user);
    console.log('changeUserPassword - userId:', userId);
    console.log('changeUserPassword - request body:', req.body);

    if (!userId) {
      console.log('changeUserPassword - No userId provided');
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: "Current password and new password are required" 
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        error: "New password must be at least 8 characters long" 
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: "New password must be different from current password" 
      });
    }

    await changePassword(userId, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      error: err.message || "Failed to change password" 
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { userId, ...updateData } = req.body;

    // Debug log to see what we're getting
    console.log('updateProfile - req.user:', req.user);
    console.log('updateProfile - userId:', userId);
    console.log('updateProfile - request body:', req.body);

    if (!userId) {
      console.log('updateProfile - No userId provided');
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const user = await updateUserProfile(userId, updateData);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: "Profile updated successfully"
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      error: err.message || "Failed to update profile" 
    });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { userId } = req.query;

    // Check if user is guest
    if (req.user?.isGuest) {
      return res.status(401).json({ success: false, error: "Login required to view profile" });
    }

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const user = await getUserById(userId);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      error: err.message || "Failed to get user profile" 
    });
  }
}