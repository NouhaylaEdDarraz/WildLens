import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
  Espèce: { type: String, required: true },
  Description: { type: String, required: true },
  "Nom latin": { type: String, required: true },
  Famille: { type: String, required: true },
  Taille: { type: String, required: true },
  Région: { type: String, required: true },
  Habitat: { type: String, required: true },
  "Fun fact": { type: String },
});

const AnimalModel = mongoose.model("AnimalModel", animalSchema);

export default AnimalModel;
