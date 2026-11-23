import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getSessionUser } from '@/lib/auth';
import { emitOrderStatusUpdated } from '@/lib/socket';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'chef') {
      return NextResponse.json({ error: 'No autorizado. Se requiere rol de cocinero.' }, { status: 403 });
    }

    const { id } = params;
    const { status } = await request.json();

    const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Estado de pedido no válido' }, { status: 400 });
    }

    await connectDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Emitir evento por WebSockets
    emitOrderStatusUpdated(id, status, updatedOrder);

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Error actualizando estado de orden:', error);
    return NextResponse.json({ error: error.message || 'Error al actualizar orden' }, { status: 500 });
  }
}
