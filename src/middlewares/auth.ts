import { response } from "../helpers/response";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../configEnv";

export interface customRequest extends FastifyRequest {
  userId: string;
}

const messageNoAuth = (reply: FastifyReply) => {
  return response(reply, 401, false, "", "no estas autorizado");
};

export const verifyToken = async (
  req: customRequest,
  reply: FastifyReply,
  done: any
) => {
  let token: string | null = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    jwt.verify(
      token,
      env.SECRET,
      {},
      async (err: jwt.VerifyErrors | null, payload: any) => {
        if (err) {
          return messageNoAuth(reply);
        }

        const user = await userModel.findById({ _id: payload._id });

        if (!user) {
          return messageNoAuth(reply);
        }
        req.userId = payload._id;
        done();
      }
    );
  }
  if (!token) {
    return messageNoAuth(reply);
  }
};
