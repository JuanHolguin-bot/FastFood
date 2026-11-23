require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Inicializar Socket.io sobre el mismo servidor HTTP
  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Guardar instancia de Socket.io en global para que las API routes puedan acceder
  global.io = io;

  io.on('connection', (socket) => {
    console.log('⚡ [Socket.io] Cliente conectado:', socket.id);

    // Unirse a sala de cocina (Kanban)
    socket.on('join:kitchen', () => {
      socket.join('room:kitchen');
      console.log(`👨‍🍳 [Socket.io] Socket ${socket.id} unido a sala de cocina`);
    });

    // Unirse a sala de cliente para seguimiento de pedido específico
    socket.on('join:order', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`📦 [Socket.io] Socket ${socket.id} suscrito a orden ${orderId}`);
    });

    // Actualización de estado de pedido enviada desde el cliente/cocinero
    socket.on('chef:update_status', ({ orderId, status, order }) => {
      console.log(`🔄 [Socket.io] Estado modificado por cocinero: ${orderId} -> ${status}`);
      // Re-emitir a todos los clientes (cocina y clientes en tiempo real)
      io.emit('order:status_updated', { orderId, status, order });
    });

    socket.on('disconnect', () => {
      console.log('🔌 [Socket.io] Cliente desconectado:', socket.id);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 > Fast_Food listo en http://${hostname}:${port}`);
    console.log(`⚡ > WebSockets activos en http://${hostname}:${port}/api/socket`);
  });
});
