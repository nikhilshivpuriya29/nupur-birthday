import bcrypt from 'bcryptjs';
import { supabase } from './supabase.js';

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Login user
export async function loginUser(username, password) {
  try {
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Check if password needs to be hashed (first login)
    if (user.password_hash.startsWith('TEMP_HASH')) {
      // First login - set real password
      const hashedPassword = await hashPassword(password);
      
      await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', user.id);
      
      return { success: true, user };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Check if user is logged in
export function isAuthenticated(cookies) {
  return cookies.get('user_id') !== undefined;
}

// Get current user
export async function getCurrentUser(cookies) {
  const userId = cookies.get('user_id')?.value;
  if (!userId) return null;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return user;
}
