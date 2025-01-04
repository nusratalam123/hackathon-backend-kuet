import express from "express";
import { chatWithBot } from "../controller/chatbot.controller";
import {  translateText } from "../controller/chat";

const router = express.Router();

// Route for chatbot interaction
router.post("/suggest", chatWithBot);
// Define the POST route for chatbot
// Define the translate route
router.post("/translate", translateText);

export default router;
