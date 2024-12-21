import { Request, Response } from "express";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const recipeDatabasePath = path.join(__dirname, "../../my_fav_recipes.txt");

// Helper Function: Load Recipes
const loadRecipes = (): string[] => {
  if (fs.existsSync(recipeDatabasePath)) {
    return fs.readFileSync(recipeDatabasePath, "utf-8").split("\n\n");
  }
  return [];
};

// Helper Function: Find Matching Recipes
export const findRecipes = (userMessage: string, availableIngredients: string[]): string[] => {
  const recipes = loadRecipes();
  const keyword = userMessage.toLowerCase();

  // Filter recipes by keywords or ingredients
  return recipes.filter(recipe => {
    const recipeLower = recipe.toLowerCase();

    // Check if the recipe matches the keyword or contains any of the available ingredients
    const keywordMatch = recipeLower.includes(keyword);
    const ingredientMatch = availableIngredients.some(ingredient =>
      recipeLower.includes(ingredient.toLowerCase())
    );

    return keywordMatch || ingredientMatch;
  });
};


export const chatWithBot = async (req: Request, res: Response) => {
  const { userMessage, availableIngredients } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message is required." });
  }

  if (!Array.isArray(availableIngredients)) {
    return res.status(400).json({ error: "Available ingredients must be an array." });
  }

  // Step 1: Use `findRecipes` to search for recipes
  const matchingRecipes = findRecipes(userMessage, availableIngredients);

  // Step 2: Respond with the first matching recipe or a fallback message
  if (matchingRecipes.length > 0) {
    const recipeReply = `I found a recipe for you:\n${matchingRecipes[0]}`;
    return res.status(200).json({ reply: recipeReply });
  } else {
    return res.status(200).json({
      reply: "I'm sorry, I couldn't find any recipes matching your query.",
    });
  }
};
