import { Router } from "express";

import { getAllRecipes,  uploadRecipe,uploadRecipes } from "../controller/recipe.controller";
import multer from "multer";

const router = Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to upload recipe (text or image)
router.post("/upload", upload.single("image"), uploadRecipe);

// Route to upload recipe (text or image)
router.post("/upload/image", upload.single("image"), uploadRecipes);

// Route to retrieve all recipes
router.get("/all", getAllRecipes);

export default router;
