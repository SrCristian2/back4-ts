import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from "../helpers/cloudinary.actions";
import { response } from "../helpers/response";
import { postModel } from "../models/post.model";

import { FastifyReply, FastifyRequest } from "fastify";
import { customRequest } from "../middlewares/auth";
import { IPost, IUploadImage } from "../interfaces/comun";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    file?: any;
  }
}

interface IParams {
  id: string;
}

export const listar = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const posts = await postModel
      .find()
      .populate({ path: "user", select: "-password" })
      .sort("-createdAt");

    response(reply, 200, true, posts, "lista de posts");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};

export const listarPostLogin = async (
  req: customRequest,
  reply: FastifyReply
) => {
  try {
    const posts = await postModel
      .find({ user: req.userId })
      .populate("user", { password: 0 })
      .sort("-createdAt");
    response(reply, 200, true, posts, "lista de posts del usuario logueado");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};

export const listOne = async (
  req: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "registro no encontrado");
    }
    response(reply, 200, true, post, "post encontrado");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};

export const add = async (
  req: FastifyRequest<{ Body: IPost }>,
  reply: FastifyReply
) => {
  try {
    const { title, description } = req.body;
    const newPost = new postModel({
      title,
      description,
      user: req.userId,
    });

    if (req.file) {
      const { secure_url, public_id } = (await subirImagenACloudinary(
        req.file
      )) as IUploadImage;
      newPost.setImg({ secure_url, public_id });
    }

    await postModel.create(newPost);
    response(reply, 201, true, newPost, "post creado");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};

export const deletePost = async (
  req: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "registro no encontrado");
    }
    // post.nameImage && deleteImg(post.nameImage);

    if (post.public_id) {
      await eliminarImagenCloudinary(post.public_id);
    }

    await post.deleteOne();

    response(reply, 200, true, "", "post eliminado");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};

export const update = async (
  req: FastifyRequest<{ Body: IPost; Params: IParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "registro no encontrado");
    }

    if (req.file) {
      // post.nameImage && deleteImg(post.nameImage);
      // post.setImg(req.file.filename);
      if (post.public_id) {
        await eliminarImagenCloudinary(post.public_id);
      }

      const { secure_url, public_id } = (await subirImagenACloudinary(
        req.file
      )) as IUploadImage;
      post.setImg({ secure_url, public_id });
      await post.save();
    }
    await post.updateOne(req.body);

    response(reply, 200, true, "", "post actualizado");
  } catch (error: any) {
    response(reply, 500, false, "", error.message);
  }
};
