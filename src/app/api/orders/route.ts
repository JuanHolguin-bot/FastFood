import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getSessionUser } from '@/lib/auth';
import { emitOrderCreated } from '@/lib/socket';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();

    let orders;
    if (session.role === 'chef') {
      // El cocinero ve todas las órdenes activas o recientes
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // El cliente ve solo sus órdenes
      orders = await Order.find({
        $or: [{ customer: session.userId }, { customerEmail: session.email }],
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error obteniendo órdenes:', error);
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      notes,
      items,
      totalAmount,
      paypalOrderId,
      paymentStatus = 'paid',
    } = body;

    if (!customerName || !customerEmail || !deliveryAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Faltan datos obligatorios para crear el pedido' }, { status: 400 });
    }

    await connectDB();

    const orderData: any = {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      notes,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus,
      paypalOrderId: paypalOrderId || `PAY-${Date.now()}`,
    };

    if (session?.userId) {
      orderData.customer = session.userId;
    }

    const order = await Order.create(orderData);

    // Emitir WebSocket a los cocineros conectados en tiempo real
    emitOrderCreated(order);

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creando orden:', error);
    return NextResponse.json({ error: error.message || 'Error al crear pedido' }, { status: 500 });
  }
}
