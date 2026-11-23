'use client';

import React, { useState, useEffect } from 'react';
import DishCard from '@/components/DishCard';
import { Utensils, Sparkles, Flame, Coffee, Pizza, Sandwich } from 'lucide-react';

const CATEGORIES = [
  'Todos',
  'Hamburguesas',
  'Pizzas',
  'Perros Calientes',
  'Combos',
  'Acompañamientos',
  'Bebidas',
];

export default function HomePage() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDishes() {
      setLoading(true);
      try {
        const url =
          selectedCategory === 'Todos'
            ? '/api/dishes'
            : `/api/dishes?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDishes(data);
        }
      } catch (err) {
        console.error('Error cargando platos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDishes();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-brand-950 text-white p-8 sm:p-12 mb-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md mb-4 border border-brand-500/30">
            <Flame className="w-4 h-4 text-brand-400" />
            <span>Sabor irresistible al instante</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Comida rápida gourmet preparada con pasión en <span className="text-brand-500">Fast_Food</span>
          </h1>
          <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
            Ordena tus platos favoritos, paga de forma segura mediante PayPal y sigue el estado de tu pedido en tiempo real con nuestra cocina conectada.
          </p>
        </div>

        {/* Decoración */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/30 to-transparent pointer-events-none" />
      </div>

      {/* Filtros de Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-105'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Platos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 flex flex-col p-4"
            >
              <div className="bg-gray-200 h-44 rounded-xl mb-4" />
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
              <div className="bg-gray-200 h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : dishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-700">No hay platos disponibles</h3>
          <p className="text-sm text-gray-400 mt-1">
            Intenta seleccionando otra categoría o ejecuta el seed del sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
