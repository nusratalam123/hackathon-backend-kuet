import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js"; // For OCR
import Recipe from "../model/recipe.model";
import sharp from "sharp";

// Save uploaded recipe (text or image)
export const uploadRecipe = async (req: Request, res: Response) => {
  const { title, ingredients, steps, taste, cuisineType, preparationTime, reviews } = req.body;
  const file = req.file;

  if (!title || !ingredients || !steps || !taste || !cuisineType || !preparationTime) {
    return res.status(400).json({ error: "Missing required recipe fields." });
  }

  try {
    // Text-based recipe
    if (!file) {
      const recipe = new Recipe({
        title,
        ingredients: ingredients.split(","),
        steps,
        taste,
        cuisineType,
        preparationTime,
        reviews: reviews || [],
        source: "text",
      });
      await recipe.save();

      // Append to `my_fav_recipes.txt`
      const recipeText = `Title: ${title}\nIngredients: ${ingredients}\nSteps: ${steps}\nTaste: ${taste}\nCuisine Type: ${cuisineType}\nPreparation Time: ${preparationTime} minutes\n\n`;
      fs.appendFileSync("my_fav_recipes.txt", recipeText);

      return res.status(201).json({ message: "Recipe added successfully.", recipe });
    }

    // Image-based recipe (OCR)
    const imagePath = path.join(__dirname, "../../uploads", file.filename);
    Tesseract.recognize(imagePath, "eng")
      .then(async ({ data: { text } }) => {
        // Parse OCR text (assume simple format for demo)
        const lines = text.split("\n");
        const ocrTitle = lines[0];
        const ocrIngredients = lines.slice(1, -1).join(", ");
        const ocrSteps = lines[lines.length - 1];

        const recipe = new Recipe({
          title: ocrTitle || "Untitled Recipe",
          ingredients: ocrIngredients.split(","),
          steps: ocrSteps || "No steps provided.",
          taste: taste || "unknown",
          cuisineType: cuisineType || "unknown",
          preparationTime: preparationTime || 0,
          reviews: reviews || [],
          source: "image",
          imageUrl: `/uploads/${file.filename}`,
        });
        await recipe.save();

        // Append to `my_fav_recipes.txt`
        const recipeText = `Title: ${ocrTitle}\nIngredients: ${ocrIngredients}\nSteps: ${ocrSteps}\nTaste: ${taste}\nCuisine Type: ${cuisineType}\nPreparation Time: ${preparationTime} minutes\n\n`;
        fs.appendFileSync("my_fav_recipes.txt", recipeText);

        res.status(201).json({ message: "Recipe added successfully from image.", recipe });
      })
      .catch((err) => {
        console.error("OCR Error:", err);
        res.status(500).json({ error: "Failed to process recipe image." });
      });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "An error occurred while adding the recipe." });
  }
};

export const uploadRecipes = async (req: Request, res: Response) => {
  const file = req.file;

  // Extract additional fields from the request body
  const { taste, cuisineType, preparationTime, reviews } = req.body;

  if (!file) {
    return res.status(400).json({ error: "No image provided." });
  }

  try {
    const imagePath = path.join(__dirname, "../../uploads", file.filename);
    const preprocessedImagePath = path.join(__dirname, "../../uploads", `processed_${file.filename}`);

    // Preprocess the image
    await sharp(imagePath)
      .resize({ width: 1000 })
      .grayscale()
      .sharpen()
      .toFile(preprocessedImagePath);

    // Perform OCR on the preprocessed image
    Tesseract.recognize(preprocessedImagePath, "eng")
      .then(async ({ data: { text } }) => {
        // Parse text to extract title, ingredients, and steps
        const { title, ingredients, steps } = parseRecipeText(text);

        // Save recipe to the database
        const recipe = new Recipe({
          title,
          ingredients,
          steps,
          taste: req.body.taste || "Unknown", // Dynamic or default
          cuisineType: req.body.cuisineType || "Unknown", // Dynamic or default
          preparationTime: req.body.preparationTime ? parseInt(req.body.preparationTime, 10) : 0,
          reviews: req.body.reviews ? JSON.parse(req.body.reviews) : [],
          source: "image",
          imageUrl: `/uploads/${file.filename}`,
        });

        await recipe.save();

        // Append to `my_fav_recipes.txt`
        const recipeText = `Title: ${title}\nIngredients: ${ingredients.join(", ")}\nSteps: ${steps}\nTaste: ${recipe.taste}\nCuisine Type: ${recipe.cuisineType}\nPreparation Time: ${recipe.preparationTime} minutes\n\n`;
        fs.appendFileSync("my_fav_recipes.txt", recipeText);

        res.status(201).json({ message: "Recipe added successfully from image.", recipe });
      })
      .catch(err => {
        console.error("OCR Error:", err);
        res.status(500).json({ error: "Failed to process recipe image." });
      });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "An error occurred while adding the recipe." });
  }
};

// Helper function to parse text
const parseRecipeText = (text: string) => {
  const lines = text.split("\n").map(line => line.trim());

  // Extract Title
  const title = lines[0] || "Untitled Recipe";

  // Extract Ingredients
  const ingredientsStartIndex = lines.findIndex(line => line.toLowerCase().includes("ingredients"));
  const stepsStartIndex = lines.findIndex(line => line.toLowerCase().includes("steps") || line.toLowerCase().includes("directions"));

  const ingredients =
    ingredientsStartIndex !== -1 && stepsStartIndex !== -1
      ? lines.slice(ingredientsStartIndex + 1, stepsStartIndex).filter(line => line)
      : [];

  const steps =
    stepsStartIndex !== -1
      ? lines.slice(stepsStartIndex + 1).join(" ")
      : "No steps provided.";

  return { title, ingredients, steps };
};

// Retrieve all recipes
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).json({ error: "Failed to retrieve recipes." });
  }
};
