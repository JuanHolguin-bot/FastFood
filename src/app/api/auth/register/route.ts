import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'customer', phone, address } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role === 'chef' ? 'chef' : 'customer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      phone: phone || '',
      address: address || '',
    });

    const token = generateToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: 'Usuario registrado con éxito',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      },
      { status: 201 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json({ error: error.message || 'Error al registrar usuario' }, { status: 500 });
  }
}
