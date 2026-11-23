'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Plus, Clock } from 'lucide-react';

interface DishCardProps {
  dish: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    preparationTimeMinutes: number;
  };
}

export default function DishCard({ dish }: DishCardProps) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
      {/* Imagen */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-brand-500" />
          <span>{dish.preparationTimeMinutes || 15} min</span>
        </div>
        <div className="absolute top-3 right-3 bg-brand-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
          ${dish.price.toLocaleString('es-CO')}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            {dish.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-brand-600 transition">
            {dish.name}
          </h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">
            ${dish.price.toLocaleString('es-CO')}
          </span>
          <button
            onClick={() =>
              addItem({
                id: dish._id,
                name: dish.name,
                price: dish.price,
                image: dish.image,
              })
            }
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
