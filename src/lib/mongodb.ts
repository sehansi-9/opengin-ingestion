import mongoose, { Mongoose } from 'mongoose';

/**
 * Global is used to maintain a cached connection across hot reloads
 * in development.
 */
declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    );
}

/**
 * Global variable to cache the mongoose connection
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 */
async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }


    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable mongoose buffering
        };
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => m);
    }

    try {
        // Wait for the connection to complete
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;