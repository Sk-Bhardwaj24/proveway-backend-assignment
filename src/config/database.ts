import mongoose, { Connection } from 'mongoose';
import { config } from 'dotenv';

config();
interface connection {
  provewayDatabaseConnection: Connection;
}

export const provewayDatabaseConnection = mongoose.createConnection(process.env.MONGO_URL ?? '');

export const connectMongodb = (): connection => {
  console.log('Database connection made successfully.');
  return {
    provewayDatabaseConnection
  };
};
