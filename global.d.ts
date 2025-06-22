import mongoose from 'mongoose';

declare global {
  interface GlobalThis {
    mongoose: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }
}

// ensure this file is a module
export {};
