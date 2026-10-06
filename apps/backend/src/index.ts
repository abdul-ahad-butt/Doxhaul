import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env } from './types/env';

// Import routes (to be created)
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import documentsRoutes from './routes/documents';
import loadsRoutes from './routes/loads';
import bookingsRoutes from './routes/bookings';
import bidsRoutes from './routes/bids';
import adminRoutes from './routes/admin';
import ticketsRoutes from './routes/tickets';
import dashboardRoutes from './routes/dashboard';
import aiRoutes from './routes/ai';
import { errorHandler } from './middleware/error-handler';

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    if (origin.includes('localhost') || origin.endsWith('.pages.dev')) {
      return origin;
    }
    return null;
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// Error handling
app.onError(errorHandler);

// Health check
app.get('/api/health', (c) => c.json({ success: true, status: 'ok', timestamp: new Date().toISOString() }));

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/profile', profileRoutes);
app.route('/api/documents', documentsRoutes);
app.route('/api/loads', loadsRoutes);
app.route('/api/bookings', bookingsRoutes);
app.route('/api/bids', bidsRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/tickets', ticketsRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/support', aiRoutes);
app.route('/api/ai', aiRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } }, 404);
});

export default app;
