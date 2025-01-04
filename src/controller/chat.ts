import axios from "axios";
import { Request, Response } from "express";

// Google Translate API key
const apiKey = "AIzaSyA1rgg5p07QClY7Nnr_e36uPj5OuDaHSno";

// Controller function for translation
export const translateText = async (req:Request, res:Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    // Make a request to the Google Translate API
    const response = await axios.post(
      "https://translation.googleapis.com/language/translate/v2",
      {
        q: text,
        target: "bn", // Target language is Bangla
        source: "en", // Source language is English-based Banglish
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: apiKey,
        },
      }
    );

    // Extract translated text
    const translatedText = response.data.data.translations[0].translatedText;

    res.json({ translatedText });
  } catch (error:any) {
    console.error("Error translating text:", error);
    res.status(500).json({ error});
  }
};
