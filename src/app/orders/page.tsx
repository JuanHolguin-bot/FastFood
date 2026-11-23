'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle2, Flame, Bike, AlertCircle, ShoppingBag } from 'lucide-react';

export default function CustomerOrdersPage() {
  const { user, loading } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Suscripción WebSocket para actualizaciones en vivo
  useEffect(() => {
    if (!socket) return;

    socket.on('order:status_updated', ({ orderId, status, order }: any) => {
      console.log('⚡ Pedido actualizado en tiempo real:', orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    });

    return () => {
      socket.off('order:status_updated');
    };
  }, [socket]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-orange-600" /> En preparación
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Bike className="w-3.5 h-3.5" /> Listo / En camino
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Entregado
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Seguimiento de Pedidos</h1>
          <p className="text-xs text-gray-500 mt-1">
            Visualiza en tiempo real el progreso de tu cocina en Fast_Food
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <span>WebSockets Activos</span>
        </div>
      </div>

      {loadingOrders ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">Aún no tienes pedidos</h3>
          <p className="text-sm text-gray-400 mt-1">
            Explora la carta y pide tu plato favorito hoy.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">PEDIDO</span>
                    <span className="font-extrabold text-gray-900">#{order._id.slice(-6)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString('es-CO')}
                  </p>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Items */}
              <div className="py-4 space-y-2">
                {order.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      <strong className="text-brand-600 mr-2">{it.quantity}x</strong>
                      {it.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${(it.price * it.quantity).toLocaleString('es-CO')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Entrega y Total */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between text-xs text-gray-500 gap-2">
                <div>
                  <span className="font-bold text-gray-700">Entrega: </span>
                  {order.deliveryAddress}
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-brand-600">
                    Total: ${order.totalAmount.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
