import mongoose from "mongoose";

const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    // Make slug unique but sparse so missing/undefined slugs don't collide
    slug: { type: String, required: false, unique: true, sparse: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", tagSchema);
