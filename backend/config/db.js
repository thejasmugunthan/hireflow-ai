import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hireflow_ai';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Initial Connection Warning: ${error.message}`);
    console.log('🔄 Will retry MongoDB connection in the background...');
    setTimeout(() => connectDB(), 5000);
  }
};
