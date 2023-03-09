import {
  add,
  deletePost,
  listar,
  listarPostLogin,
  listOne,
  update,
} from "../controllers/post.controller";
import { verifyToken } from "../middlewares/auth";
import { upload } from "../middlewares/imgUpload";

const middleware = (req: any, reply: any, done: any) => {
  verifyToken(req, reply, done);
};

export const postRoutes = (fastify: any, opts: any, done: any) => {
  fastify.get("/", { preHandler: [middleware] }, listar);
  fastify.get("/user", { preHandler: [middleware] }, listarPostLogin);
  fastify.get("/:id", { preHandler: [middleware] }, listOne);
  fastify.post("/", { preHandler: [middleware, upload.single("img")] }, add);
  fastify.delete("/:id", { preHandler: [middleware] }, deletePost);
  fastify.put(
    "/:id",
    { preHandler: [middleware, upload.single("img")] },
    update
  );

  done();
};
