'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Utensils, LogOut, User, ChefHat, Clock } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Fast<span className="text-brand-600">_Food</span>
            </span>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4">
          {user?.role === 'chef' && (
            <Link
              href="/chef"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200/80 hover:bg-amber-100 transition"
            >
              <ChefHat className="w-4 h-4 text-amber-600" />
              <span>Cocina Kanban</span>
            </Link>
          )}

          {user && user.role !== 'chef' && (
            <Link
              href="/orders"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 transition"
            >
              <Clock className="w-4 h-4" />
              <span>Mis Pedidos</span>
            </Link>
          )}

          {/* Cart Button */}
          {user?.role !== 'chef' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              aria-label="Ver Carrito"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* User Status / Login */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-800 leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user.role === 'chef' ? '👨‍🍳 Cocinero' : 'Cliente'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-600 transition"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-semibold text-white bg-brand-600 rounded-xl shadow-sm hover:bg-brand-700 transition shadow-brand-500/20"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
