import { getSupabase } from '../config/supabase';
import { User, SignupRequest, LoginRequest } from '../types/auth.types';
import { hashPassword, comparePassword, isValidEmail, isValidPassword, generateId } from '../utils/crypto';

class AuthService {
  private supabase = getSupabase();

  async signup(data: SignupRequest): Promise<User> {
    // Validate inputs
    if (!isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = isValidPassword(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message || 'Invalid password');
    }

    if (data.password !== data.passwordConfirm) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', data.email.toLowerCase())
      .single();

    if (existingUser && !checkError) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const userId = generateId();
    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: data.email.toLowerCase(),
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || null,
          password_hash: passwordHash,
          is_email_verified: false,
          is_phone_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapToUser(newUser);
  }

  async login(data: LoginRequest): Promise<User> {
    // Validate inputs
    if (!isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (!data.password) {
      throw new Error('Password is required');
    }

    // Find user
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', data.email.toLowerCase())
      .single();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await this.supabase
      .from('users')
      .update({ last_login_at: new Date() })
      .eq('id', user.id);

    return this.mapToUser(user);
  }

  async getUserById(userId: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return null;
    }

    return this.mapToUser(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return null;
    }

    return this.mapToUser(user);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapToUser(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get user
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message || 'Invalid password');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    const { error } = await this.supabase
      .from('users')
      .update({ password_hash: passwordHash, updated_at: new Date() })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      phone: data.phone,
      firstName: data.first_name,
      lastName: data.last_name,
      passwordHash: data.password_hash,
      isEmailVerified: data.is_email_verified,
      isPhoneVerified: data.is_phone_verified,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastLoginAt: data.last_login_at ? new Date(data.last_login_at) : undefined
    };
  }
}

export default new AuthService();
