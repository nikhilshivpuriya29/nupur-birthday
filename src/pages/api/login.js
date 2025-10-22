import { loginUser } from '../../lib/auth.js';

export async function POST({ request, cookies, redirect }) {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await loginUser(username, password);
    
    if (result.success && result.user) {
      // Set cookies
      cookies.set('user_id', result.user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax'
      });
      
      cookies.set('user_role', result.user.role, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax'
      });

      return redirect('/our-space', 302);
    } else {
      return new Response(JSON.stringify({ error: result.error || 'Login failed' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
