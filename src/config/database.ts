// src/config/database.ts
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDatabase = async (): Promise<void> => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI não definida no arquivo .env');
    }

    try {
        await mongoose.connect(
            MONGODB_URI,
            { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
        );
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error("Erro ao conectar no MongoDB:", error);
        process.exit(1);
    }
}

export default connectDatabase;