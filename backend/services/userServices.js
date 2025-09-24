import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';

export async function addUser(firstName, lastName, email, password) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const user = new User({ firstName, lastName, email, password });
    return await user.save();
}

export async function fetchUsers() {
    return await User.find().select('-password');
}

export async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        return null;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return null;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return user;
}

export function generateAuthToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
}

export async function getUserById(userId) {
    return await User.findById(userId).select('-password');
}
