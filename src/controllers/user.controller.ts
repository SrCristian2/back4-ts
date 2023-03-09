import { encryptPassword } from "../helpers/encryptPassword";
import { generateToken } from "../helpers/generarToken";
import { response } from "../helpers/response";
import { userModel } from "../models/user.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { IUser } from "../interfaces/comun";



export const register = async (
  req: FastifyRequest<{
    Body: IUser;
  }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return response(
        reply,
        409,
        false,
        "",
        "el correo ya existe en otro registro"
      );
    }

    const passwordEncrypt = encryptPassword(password);

    const newUser = new userModel({ name, email, password: passwordEncrypt });

    await newUser.save();

    const token = generateToken({ _id: newUser._id });

    response(
      reply,
      201,
      true,
      { ...newUser.toJSON(), password: null, token },
      "Usuario creado"
    );
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};

export const login = async (
  req: FastifyRequest<{
    Body: IUser;
  }>,
  reply: FastifyReply
) => {
  try {
    const { password, email } = req.body;

    const user = await userModel.findOne({ email });

    if (user && user.matchPassword(password)) {
      const token = generateToken({ _id: user._id });
      return response(
        reply,
        200,
        true,
        { ...user.toJSON(), password: null, token },
        "Bienvenido"
      );
    }

    response(reply, 400, false, "", "email o password incorrectos");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};
