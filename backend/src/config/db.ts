import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // 1. Validate environment variable
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    // 2. Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // 3. Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    // 4. Attempt connection
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // 5. Improved error logging
    console.error('❌ MongoDB Connection Error:', error instanceof Error ? error.message : error);
    
    // 6. Graceful shutdown
    process.exit(1);
  }
};

export default connectDB;