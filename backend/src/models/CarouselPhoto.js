import mongoose from "mongoose";

const carouselPhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" }, // solo si se subió a Cloudinary desde el panel
    position: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("CarouselPhoto", carouselPhotoSchema);