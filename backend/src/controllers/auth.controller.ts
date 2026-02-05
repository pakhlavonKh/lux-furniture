import { Request, Response } from 'express';
import authService from '../services/auth.service.js';
import { generateAccessToken, generateRefreshToken } from '../services/token.service.js';
import { SignupRequest, LoginRequest } from '../types/auth.types.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, passwordConfirm, firstName, lastName, phone } = req.body as SignupRequest;

    const user = await authService.signup({
      email,
      password,
      passwordConfirm,
      firstName,
      lastName,
      phone
    });

    const token = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    res.status(400).json({
      success: false,
      message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    const user = await authService.login({ email, password });

    const token = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({
      success: false,
      message
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    res.status(500).json({
      success: false,
      message
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
      return;
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to change password';
    res.status(400).json({
      success: false,
      message
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const user = await authService.updateUser(userId, {
      firstName,
      lastName,
      phone
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    res.status(400).json({
      success: false,
      message
    });
  }
};
