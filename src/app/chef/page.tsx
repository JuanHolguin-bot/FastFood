'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  Clock,
  Flame,
  CheckCircle2,
  Bike,
  User,
  MapPin,
  RefreshCw,
  Bell,
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

const COLUMNS = [
  { id: 'pending', title: 'Pendiente', color: 'border-amber-400 bg-amber-50/40 text-amber-900', icon: Clock },
  { id: 'preparing', title: 'En preparación', color: 'border-orange-500 bg-orange-50/40 text-orange-900', icon: Flame },
  { id: 'ready', title: 'Listo', color: 'border-blue-500 bg-blue-50/40 text-blue-900', icon: Bike },
  { id: 'delivered', title: 'Entregado', color: 'border-green-500 bg-green-50/40 text-green-900', icon: CheckCircle2 },
];

export default function ChefDashboardPage() {
  const { user, loading } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'chef') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Cargar órdenes
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'chef') {
      fetchOrders();
    }
  }, [user]);

  // Escuchar eventos en tiempo real
  useEffect(() => {
    if (!socket) return;

    socket.emit('join:kitchen');

    // Nuevo pedido ingresado por cliente
    socket.on('order:created', (newOrder: Order) => {
      console.log('👨‍🍳 [Kanban] Nuevo pedido recibido:', newOrder);
      setOrders((prev) => [newOrder, ...prev]);
    });

    // Estado cambiado por otro cocinero o el servidor
    socket.on('order:status_updated', ({ orderId, status }: any) => {
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status } : ord))
      );
    });

    return () => {
      socket.off('order:created');
      socket.off('order:status_updated');
    };
  }, [socket]);

  // Mover de columna mediante API y Drag and Drop
  const moveOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Actualización optimista en UI
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revertir si falló
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  // Handlers para Drag & Drop nativo de HTML5 (altamente reactivo y ligero)
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
    setDraggedOrderId(orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Order['status']) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (orderId) {
      moveOrderStatus(orderId, targetStatus);
    }
    setDraggedOrderId(null);
  };

  if (loading || !user || user.role !== 'chef') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500 font-semibold">Verificando acceso a cocina...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Cocinero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Tablero Kanban de Cocina
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Arrastra y suelta pedidos entre columnas para cambiar su estado en tiempo real
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refrescar</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>Sincronización WebSocket</span>
          </div>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.id);
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id as any)}
              className="bg-gray-50/70 rounded-3xl p-4 border border-gray-200/80 flex flex-col min-h-[650px]"
            >
              {/* Header Columna */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-gray-700" />
                  <h3 className="font-bold text-sm text-gray-900">{col.title}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                  {colOrders.length}
                </span>
              </div>

              {/* Lista de Pedidos en la columna */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colOrders.map((order) => (
                  <div
                    key={order._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order._id)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/90 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 group relative"
                  >
                    {/* Header Tarjeta */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-xs font-extrabold text-brand-600">
                        #{order._id.slice(-6)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Cliente */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{order.customerName}</span>
                    </div>

                    {/* Dirección */}
                    <div className="mt-1 flex items-start gap-1.5 text-[11px] text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{order.deliveryAddress}</span>
                    </div>

                    {/* Platos */}
                    <div className="mt-3 pt-2 border-t border-gray-50 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-800">
                          <span>
                            <span className="font-extrabold text-brand-600 mr-1.5">
                              {it.quantity}x
                            </span>
                            {it.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Notas si existen */}
                    {order.notes && (
                      <p className="mt-2 text-[10px] bg-amber-50 text-amber-800 p-2 rounded-lg font-medium border border-amber-100">
                        📝 {order.notes}
                      </p>
                    )}

                    {/* Botones de acción rápida para avanzar estado */}
                    <div className="mt-3 pt-2 border-t border-gray-100 flex gap-1 justify-end">
                      {col.id === 'pending' && (
                        <button
                          onClick={() => moveOrderStatus(order._id, 'preparing')}
                          className="px-2.5 py-1 bg-orange-100 text-orange-800 hover:bg-orange-200 text-[11px] font-bold rounded-lg transition"
                        >
                          → Preparar
                        </button>
                      )}
                      {col.id === 'preparing' && (
                        <button
                          onClick={() => moveOrderStatus(order._id, 'ready')}
                          className="px-2.5 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 text-[11px] font-bold rounded-lg transition"
                        >
                          → Listo
                        </button>
                      )}
                      {col.id === 'ready' && (
                        <button
                          onClick={() => moveOrderStatus(order._id, 'delivered')}
                          className="px-2.5 py-1 bg-green-100 text-green-800 hover:bg-green-200 text-[11px] font-bold rounded-lg transition"
                        >
                          → Entregar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
