/**
 * Helper para emitir eventos de WebSocket desde cualquier API Route de Next.js
 */
export function getSocketIO() {
  return (global as any).io || null;
}

export function emitOrderCreated(order: any) {
  const io = getSocketIO();
  if (io) {
    console.log('📡 [WebSocket] Emitiendo nuevo pedido:', order._id);
    io.emit('order:created', order);
  }
}

export function emitOrderStatusUpdated(orderId: string, status: string, order: any) {
  const io = getSocketIO();
  if (io) {
    console.log(`📡 [WebSocket] Emitiendo actualización de estado: ${orderId} -> ${status}`);
    io.emit('order:status_updated', { orderId, status, order });
  }
}
