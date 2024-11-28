import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageData: { type: Buffer, required: true },
  imageContentType: { type: String, required: true },
  predictedClasses: [
    {
      class: { type: String },
      score: { type: Number },
    },
  ],
  exifData: { type: mongoose.Schema.Types.Mixed },
});
const imagesData = mongoose.model("image", imageSchema);
export default imagesData;
