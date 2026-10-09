import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

// Session cookie expiry: 30 days (matches refresh token session lifespan)
// The backend handles exact 15-minute access token expiry and returns 401 for silent refresh
const SESSION_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * POST /api/session
 * Securely writes httpOnly cookies on the Next.js server side.
 * JavaScript (document.cookie / XSS) cannot read or manipulate these cookies.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, refreshToken } = body;

    const cookieStore = await cookies();

    if (token) {
      cookieStore.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_COOKIE_MAX_AGE,
      });
    }

    if (refreshToken) {
      cookieStore.set({
        name: REFRESH_COOKIE_NAME,
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_COOKIE_MAX_AGE,
      });
    }

    return NextResponse.json({ success: true, message: 'HttpOnly session set successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to set session cookies';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/session
 * Securely removes the httpOnly session cookies upon logout.
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    cookieStore.delete(REFRESH_COOKIE_NAME);

    return NextResponse.json({ success: true, message: 'Session cookies cleared' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear session cookies';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * GET /api/session
 * Checks server-side cookie status.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;

    return NextResponse.json({
      isAuthenticated: !!token,
      token,
      refreshToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get session';
    return NextResponse.json({ isAuthenticated: false, token: null, error: message }, { status: 500 });
  }
}

