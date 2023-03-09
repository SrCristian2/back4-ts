import mongoose from "mongoose";
import { env } from "./configEnv";

mongoose.set("strictQuery", false);

// const uri =
//   "mongodb+srv://Cristian:515837020l@cluster0.ywnwo5p.mongodb.net/fastifybk4";

export const connectDb = async () => {
  try {
    const db = await mongoose.connect(env.MONGO_URI);
    console.log("base de datos conectada", db.connection.name);
  } catch (error:any) {
    console.log("error al conectar a la base de datos", error.message);
  }
};
