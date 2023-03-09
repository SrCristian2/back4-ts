import { login, register } from "../controllers/user.controller";

export const userRoutes = (fastify: any, opts: any, done: any) => {
  fastify.post("/register", register);
  fastify.post("/login", login);

  done();
};
