import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Order ID requerido' }, { status: 400 });
    }

    return NextResponse.json({
      status: 'COMPLETED',
      id: orderID,
      payer: {
        email_address: 'customer@fastfood.com',
      },
    });
  } catch (error: any) {
    console.error('Error capturando orden PayPal:', error);
    return NextResponse.json({ error: 'Error al capturar orden' }, { status: 500 });
  }
}
