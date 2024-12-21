import { Router } from "express";

import recipeRoutes from "../routes/recipe.route";
import ingredientRoutes from "../routes/ingredient.route";
import chatbotRoutes from "../routes/chatbot.route";

const router = Router();

// Root route
router.get("/", (_, res) => {
  res.send("App Working successfully");
});

// general Routes
router.use("/chat", chatbotRoutes);
router.use("/recipe", recipeRoutes);
router.use("/ingredient", ingredientRoutes);

// Handle not found
router.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default router;
