import mongoose from "mongoose";
import validator from "validator";

const ingredientSchema= new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    status:{
     type:String,
     enum:["shopping","cooking"],
     default:"Shopping"
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);


const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
