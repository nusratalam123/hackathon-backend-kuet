import { NextFunction, Request, Response } from "express";
import Ingredient from "./../model/ingredient.model";

// create new ingredient
export const createIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;

    console.log(data);

    if (!data) {
      res.status(400).json({
        message: "Data can't be empty",
      });
    }

    const user = await Ingredient.create(data);

    res.status(201).json({
      message: "Ingredient created Successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateIngredient = async (req: Request, res: Response) => {
  try {
      const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({
        message: "update Ingredient Successfully",
        data: updatedIngredient});
  } catch (error:any) {
      res.status(500).json({ error: error.message });
  }
};

export const getIngredients = async (req: Request, res: Response) => {
  try {
      const ingredients = await Ingredient.find();
      res.status(200).json({
        message: "get all ingredient Successfully",
      data:ingredients,
      });
  } catch (error:any) {
      res.status(500).json({ error: error.message });
  }
};



// Update ingredient quantities based on shopping or cooking
export const updateIngredientQuantities = async (req: Request, res: Response) => {
  const { ingredients, status } = req.body;

  // Validate input
  if (!Array.isArray(ingredients) || !status) {
    return res.status(400).json({ error: "Invalid input. Provide ingredients and status." });
  }

  if (!["shopping", "cooking"].includes(status.toLowerCase())) {
    return res.status(400).json({ error: "Status must be 'shopping' or 'cooking'." });
  }

  try {
    // Loop through the ingredients and update the database
    const updates = ingredients.map(async (item: { name: string; quantity: number }) => {
      const ingredient = await Ingredient.findOne({ name: item.name });

      if (!ingredient) {
        return { error: `Ingredient '${item.name}' not found.` };
      }

      // Update quantity based on status
      const newQuantity =
        status.toLowerCase() === "shopping"
          ? ingredient.quantity + item.quantity
          : ingredient.quantity - item.quantity;

      // Ensure quantity doesn't go below zero
      ingredient.quantity = Math.max(newQuantity, 0);
      ingredient.status = status.toLowerCase();

      // Save the updated ingredient
      await ingredient.save();

      return ingredient;
    });

    const results = await Promise.all(updates);
    res.status(200).json({ message: "Ingredients updated successfully.", results });
  } catch (error) {
    console.error("Error updating ingredients:", error);
    res.status(500).json({ error: "An error occurred while updating ingredients." });
  }
};