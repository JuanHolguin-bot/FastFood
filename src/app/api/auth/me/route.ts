import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

export async function POST() {
  // Logout
  const response = NextResponse.json({ message: 'Sesión cerrada con éxito' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
