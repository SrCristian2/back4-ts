import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

interface IPost extends Document {
  title: string;
  description: string;
  imgUrl?: string;
  public_id?: string;
  user?: mongoose.Types.ObjectId;
  setImg(image: { secure_url: string; public_id: string }): void;
}

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "el campo titulo es obligatorio"],
    },
    description: {
      type: String,
      required: [true, "el campo description es obligatorio"],
    },

    imgUrl: { type: String, default: null },
    // nameImage: String,
    public_id: String,

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

interface image {
  secure_url: string;
  public_id: string;
}

postSchema.methods.setImg = function setImg(this:IPost,{ secure_url, public_id }: image) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const postModel = model<IPost>("post", postSchema);
