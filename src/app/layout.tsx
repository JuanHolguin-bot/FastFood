import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SocketProvider } from '@/context/SocketContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Fast_Food | Restaurante & Pedidos en Tiempo Real',
  description: 'Sistema moderno de reserva y pedido de platos con seguimiento en tiempo real y pagos con PayPal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <CartProvider>
            <SocketProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 pb-16">{children}</main>
                <CartDrawer />
              </div>
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
