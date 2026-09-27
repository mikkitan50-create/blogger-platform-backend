import dns from 'node:dns';
import mongoose from 'mongoose';
import { SETTINGS } from '../settings/config';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function runDB(url: string): Promise<void> {
  try {
    await mongoose.connect(url, { dbName: SETTINGS.DB_NAME });
    console.log('✅ Connected to the database (mongoose)');
  } catch (e) {
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb(): Promise<void> {
  await mongoose.disconnect();
}