import { hashPassword, comparePassword } from './hash.js';
import { supabase } from './supabase.js';

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
      const hashedPassword = await hashPassword(password);
      await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', user.id);
      return { success: true, user };
    }

    // Compare password normally
    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Keep your existing session helper functions here
export function isAuthenticated(cookies) {
  return cookies.get('user_id') !== undefined;
}

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
