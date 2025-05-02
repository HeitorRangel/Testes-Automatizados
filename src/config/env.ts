import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), 
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  )
});

export const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.MONGODB_URI || '',
    type: 'mongodb'
  },
  logLevel: process.env.LOG_LEVEL || 'info'
};