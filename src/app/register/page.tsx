'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle, ChefHat } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'chef'>('customer');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await register({
      name,
      email,
      password,
      role,
      phone,
      address,
    });

    if (!success) {
      setError('Error al registrar usuario. Comprueba si el correo ya existe.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Crear Cuenta</h2>
          <p className="text-xs text-gray-500 mt-1">
            Únete a Fast_Food como cliente o miembro del equipo de cocina
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Rol */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                role === 'customer'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('chef')}
              className={`p-3 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                role === 'chef'
                  ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Cocinero</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Correo Electrónico (Cualquier dominio)
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@gmail.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Teléfono de Contacto
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="300 123 4567"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Dirección Habitual
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle 10 # 40-20"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
