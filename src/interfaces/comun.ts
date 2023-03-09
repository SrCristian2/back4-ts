import mongoose from "mongoose";

export interface IUploadImage {
  secure_url: string;
  public_id: string;
}

export interface IPayload {
  _id: mongoose.Types.ObjectId;
}

export interface IPost {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imgUrl?: string;
  public_id?: string;
  user?: mongoose.Types.ObjectId;
}

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;

}
