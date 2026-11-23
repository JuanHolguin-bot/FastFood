import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDish extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del plato es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['Hamburguesas', 'Pizzas', 'Perros Calientes', 'Acompañamientos', 'Bebidas', 'Combos'],
      default: 'Hamburguesas',
    },
    image: {
      type: String,
      required: [true, 'La URL de la imagen es obligatoria'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    preparationTimeMinutes: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

export const Dish: Model<IDish> = mongoose.models.Dish || mongoose.model<IDish>('Dish', DishSchema);
