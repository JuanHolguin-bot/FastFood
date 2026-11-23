'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Tu Pedido</h2>
              <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Listado de items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-600 font-medium">Tu carrito está vacío</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Explora nuestro menú y añade los platos más deliciosos de Fast_Food.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50/70 p-3 rounded-2xl border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs font-semibold text-brand-600 mt-0.5">
                      ${item.price.toLocaleString('es-CO')}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total a pagar</span>
                  <span className="text-brand-600">${totalPrice.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  Vaciar
                </button>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-brand-500/25 transition active:scale-[0.99]"
                >
                  <span>Proceder al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
