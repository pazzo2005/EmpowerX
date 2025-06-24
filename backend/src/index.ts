import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// 1. Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// 2. CORS Configuration (Enhanced)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add other domains as needed
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// 3. Request Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Logging (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 5. Database Connection
connectDB()
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// 6. API Routes
app.use('/api/auth', authRoutes);

// 7. Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 Backend API is operational',
    timestamp: new Date().toISOString(),
  });
});

// 8. Test Route
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Y2Prove Backend API</h1>
    <p>Server is running</p>
    <ul>
      <li><a href="/api/health">Health Check</a></li>
      <li><a href="/api/auth">Auth Routes</a></li>
    </ul>
  `);
});

// 9. Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error:', err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
  });
});

// 10. Start Server
const server = app.listen(PORT, () => {
  console.log(`🌐 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`   Access URLs:
   - Local:    http://localhost:${PORT}
   - Network:  http://${require('ip').address()}:${PORT}
  `);
});

// 11. Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('💥 Unhandled Rejection:', err.name, err.message);
  server.close(() => process.exit(1));
});

// 12. Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.name, err.message);
  process.exit(1);
});