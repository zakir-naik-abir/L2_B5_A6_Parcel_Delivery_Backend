import mongoose from "mongoose";
import { Server } from "http";
import { envVars } from "./app/config/env";
import app from "./app";
import { sendSuperAdmin } from "./app/utils/sendSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    server = app.listen(envVars.PORT, () => {
      console.log(`🚚 Parcel Delivery API is running on Port: ${envVars.PORT}`);
    });

    await mongoose.connect(envVars.DB_URL)
    console.log(`✅ Connected to MongoDB Successfully!`)

  } catch (error) {
    console.log(`❌ Failed to connect ${error}`);
  }
};

(async () => {
  await startServer()
  await sendSuperAdmin()
  await connectRedis()
})();

process.on("SIGTERM", () => {
  console.log("Sigterm signal received... Server shutting down...");

  if(server){
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
});

process.on("SIGINT", () => {
  console.log("Sigint signal received... Server shutting down...")

  if(server){
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down...", err)

  if(server){
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down...", err)

  if(server){
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
});