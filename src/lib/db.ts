import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fast_food';

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en .env.local');
}

/**
 * Cache global de conexión para evitar múltiples conexiones en HMR de Next.js
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Conexión establecida con MongoDB');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Error conectando a MongoDB:', e);
    throw e;
  }

  return cached.conn;
}
