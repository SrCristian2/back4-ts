import jwt from "jsonwebtoken";
import { env } from "../configEnv";
import { IPayload } from "../interfaces/comun";

export const generateToken = (payload: IPayload) => {
  try {
    const token = jwt.sign(payload, env.SECRET, {
      expiresIn: "30d",
    });
    return token;
  } catch (error: any) {
    console.log("error en generateToken", error.message);
  }
};
