import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  dish: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IOrder extends Document {
  customer?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paypalOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    dish: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    customerName: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'El correo del cliente es obligatorio'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'El teléfono de contacto es obligatorio'],
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'La dirección de entrega es obligatoria'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: any[]) => val.length > 0, 'La orden debe contener al menos un plato'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'delivered'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paypalOrderId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
