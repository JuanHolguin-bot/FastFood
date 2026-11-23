import { NextResponse } from 'next/server';

/**
 * Endpoints simulados o con PayPal REST API para crear y capturar pedidos
 */
export async function POST(request: Request) {
  try {
    const { amount, currency = 'USD' } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    // Generar un ID de orden simulado / PayPal Sandbox
    const mockPaypalOrderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    return NextResponse.json({
      id: mockPaypalOrderId,
      status: 'CREATED',
      amount,
      currency,
    });
  } catch (error: any) {
    console.error('Error PayPal create order:', error);
    return NextResponse.json({ error: 'Error al procesar orden de PayPal' }, { status: 500 });
  }
}
