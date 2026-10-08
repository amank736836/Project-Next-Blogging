import mongoose from "mongoose";

// BUG-017 fix: Move the MONGO_URI check inside dbConnect() so that the
// module can be imported without the variable set. This allows the build
// to succeed without a database connection string.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGO_URI = process.env.MONGO_URI;

  // BUG-017 fix: fail at connection time, not at import time.
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGO_DB || "blog",
    };

    // BUG-012 fix: clear cached.promise on rejection so the next call
    // retries instead of replaying the same error forever.
    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => mongoose)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
