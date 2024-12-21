import express from "express";
import { chatWithBot } from "../controller/chatbot.controller";

const router = express.Router();

// Route for chatbot interaction
router.post("/suggest", chatWithBot);

export default router;
