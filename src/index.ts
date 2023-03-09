import Fastify from "fastify";
import cors from "@fastify/cors";
import formBody from "@fastify/formbody";
import multer from "fastify-multer";
import { connectDb } from "./database";
import { userRoutes } from "./routes/user.routes";
import { postRoutes } from "./routes/post.routes";
import { env } from "./configEnv";

const fastify = Fastify({
  logger: true,
});

fastify.register(connectDb);

fastify.register(cors, { origin: "*" });
fastify.register(formBody);
fastify.register(multer.contentParser);

//ROUTES
fastify.register(userRoutes, { prefix: "/user" });
fastify.register(postRoutes, { prefix: "/post" });

const start = async () => {
  try {
    await fastify.ready();
    fastify.listen({ port: 4000, host: env.HOST });
    console.log("servidor escuchando por el puerto 4000");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start();
