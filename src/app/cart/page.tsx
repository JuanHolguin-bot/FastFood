'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { ShoppingBag, MapPin, Phone, User, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Conversión aproximada para sandbox PayPal (en USD si aplica) o simulación
  const amountUSD = Math.max(1, Math.round(totalPrice / 4000)).toString();

  const handleOrderCreation = async (paypalOrderId = '') => {
    if (!customerName || !customerEmail || !deliveryAddress) {
      setErrorMessage('Por favor completa todos los campos de entrega obligatorios.');
      return false;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        notes,
        items: items.map((i) => ({
          dish: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        totalAmount: totalPrice,
        paypalOrderId,
        paymentStatus: 'paid',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const createdOrder = await res.json();
        clearCart();
        setOrderSuccess(createdOrder);
        return true;
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Error al procesar el pedido.');
        return false;
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Hubo un problema de conexión al guardar el pedido.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">¡Pedido y Reserva Confirmados!</h2>
          <p className="text-gray-500 text-sm mt-2">
            Tu orden <span className="font-bold text-gray-800">#{orderSuccess._id.slice(-6)}</span> ha sido enviada a la cocina de Fast_Food en tiempo real.
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-left space-y-2 text-sm border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">Dirección:</span>
              <span className="font-semibold text-gray-800">{orderSuccess.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Pagado (PayPal):</span>
              <span className="font-bold text-brand-600">${orderSuccess.totalAmount.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estado inicial:</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold uppercase">
                {orderSuccess.status}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/orders')}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition"
            >
              Seguir en Vivo
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Tu carrito está vacío</h2>
        <p className="text-sm text-gray-500 mt-2">Añade algunos platos para poder realizar el pago.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl"
        >
          Explorar Menú
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de entrega */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <span>Información de Entrega y Contacto</span>
            </h3>

            {errorMessage && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="300 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Dirección de Entrega Exacta *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ej: Carrera 45 # 67-12, Apto 302"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Notas de Entrega / Instrucciones Especiales
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Sin cebolla, tocar timbre fuerte..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen & Pago con PayPal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-gray-400 font-semibold">{item.quantity}x</span>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total a Pagar</span>
                <span className="text-brand-600">${totalPrice.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Integración PayPal */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <span>Pagar con PayPal Sandbox</span>
              </h4>

              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
                  currency: 'USD',
                }}
              >
                <div className="min-h-[140px]">
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'pill', label: 'pay' }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                          {
                            description: 'Pedido en Fast_Food',
                            amount: {
                              value: amountUSD,
                              currency_code: 'USD',
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        console.log('PayPal capture details:', details);
                        await handleOrderCreation(details.id);
                      } else {
                        await handleOrderCreation(data.orderID);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      // Fallback en caso de credenciales sandbox test locales
                      setErrorMessage('Nota de prueba: Si el SDK de PayPal no carga en tu red, puedes usar el botón de prueba directa abajo.');
                    }}
                  />
                </div>
              </PayPalScriptProvider>

              {/* Botón Simulación de Pago Rápido para Pruebas / Desarrollo */}
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleOrderCreation(`MOCK-PAYPAL-${Date.now()}`)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  {isProcessing ? 'Procesando...' : '⚡ Confirmar Pedido Directo (Modo Demo)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
