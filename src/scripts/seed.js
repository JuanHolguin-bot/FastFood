require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fast_food';

// Esquemas mínimos para el script de seed
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    phone: String,
    address: String,
  },
  { timestamps: true }
);

const DishSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    available: Boolean,
    preparationTimeMinutes: Number,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Dish = mongoose.models.Dish || mongoose.model('Dish', DishSchema);

const INITIAL_DISHES = [
  {
    name: 'Burger Clásica Fast_Food',
    description: 'Carne 100% de res a la parrilla (180g), queso cheddar fundido, tocineta crujiente, lechuga fresca y salsa de la casa.',
    price: 24900,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 15,
  },
  {
    name: 'Doble Bacon Deluxe',
    description: 'Doble carne de res, cuádruple queso americano, cebolla caramelizada y doble porción de tocineta ahumada.',
    price: 32500,
    category: 'Hamburguesas',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 20,
  },
  {
    name: 'Pizza Pepperoni Artesanal',
    description: 'Masa madurada 48 horas, salsa pomodoro italiana, queso mozzarella fundido y abundante pepperoni premium.',
    price: 38000,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 20,
  },
  {
    name: 'Pizza Cuatro Quesos',
    description: 'Deliciosa combinación de queso mozzarella, parmesano, gorgonzola y provolone con toque de orégano fresco.',
    price: 41000,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 18,
  },
  {
    name: 'Perro Caliente Especial Fast_Food',
    description: 'Salchicha americana jumbo en pan brioche, queso fundido, tocineta crocante, ripio de papa y salsas especiales.',
    price: 18900,
    category: 'Perros Calientes',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 12,
  },
  {
    name: 'Combo Pareja (2 Burgers + Papas + Bebidas)',
    description: '2 Hamburguesas Clásicas + porción grande de papas rústicas + 2 gaseosas a elección.',
    price: 54900,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 22,
  },
  {
    name: 'Papas Rústicas con Queso Cheddar y Tocineta',
    description: 'Papas en cascos con piel crujiente, bañadas en queso cheddar líquido caliente y trozos de tocineta.',
    price: 16500,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 10,
  },
  {
    name: 'Gaseosa 400ml',
    description: 'Refrescante bebida a elección (Coca-Cola, Sprite, Colombiana, Manzana).',
    price: 6000,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    available: true,
    preparationTimeMinutes: 3,
  },
];

async function seed() {
  try {
    console.log('Conectando a MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado');

    // 1. Limpiar e insertar platos
    await Dish.deleteMany({});
    await Dish.insertMany(INITIAL_DISHES);
    console.log(`✅ ${INITIAL_DISHES.length} platos creados exitosamente.`);

    // 2. Crear usuarios demo (Cliente y Cocinero)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    await User.deleteMany({
      email: { $in: ['cliente@fastfood.com', 'cocinero@fastfood.com'] },
    });

    await User.create([
      {
        name: 'Cliente Demo Fast_Food',
        email: 'cliente@fastfood.com',
        password: passwordHash,
        role: 'customer',
        phone: '3001234567',
        address: 'Calle 10 # 40-20, Apto 501',
      },
      {
        name: 'Chef Principal Fast_Food',
        email: 'cocinero@fastfood.com',
        password: passwordHash,
        role: 'chef',
        phone: '3109876543',
        address: 'Cocina Central Fast_Food',
      },
    ]);

    console.log('✅ Usuarios creados:');
    console.log('   👨‍🍳 Cocinero: cocinero@fastfood.com (clave: 123456)');
    console.log('   👤 Cliente:  cliente@fastfood.com  (clave: 123456)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();
