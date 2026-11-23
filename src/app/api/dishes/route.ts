import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Dish } from '@/models/Dish';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    await connectDB();

    const query: any = { available: true };
    if (category && category !== 'Todos') {
      query.category = category;
    }

    const dishes = await Dish.find(query).sort({ category: 1, name: 1 });
    return NextResponse.json(dishes);
  } catch (error: any) {
    console.error('Error obteniendo platos:', error);
    return NextResponse.json({ error: 'Error al obtener platos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'chef') {
      return NextResponse.json({ error: 'No autorizado. Solo cocineros pueden crear platos.' }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();

    const newDish = await Dish.create(body);
    return NextResponse.json(newDish, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al crear plato' }, { status: 500 });
  }
}
