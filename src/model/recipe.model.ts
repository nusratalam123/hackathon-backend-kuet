import mongoose, { Schema } from "mongoose";
import validator from "validator";

// Define the Review interface and schema
export interface IReview {
  user: string;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: String, required: true },
    taste: { type: String, required: true },
    cuisineType: { type: String, required: true },
    preparationTime: { type: Number, required: true },
    reviews: { type: [reviewSchema], default: [] },
    source: { type: String, enum: ["text", "image"], required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
