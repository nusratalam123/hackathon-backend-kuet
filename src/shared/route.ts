import { Router } from "express";

import chatbotRoutes from "../routes/chatbot.route";
import textRoutes from "../routes/textGeneration.route";
import authRoutes from "../routes/auth.route";




const router = Router();

// Root route
router.get("/", (_, res) => {
  res.send("App Working successfully");
});

// general Routes

router.use("/auth", authRoutes);
router.use("/chat", chatbotRoutes);
router.use("/text", textRoutes);


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
