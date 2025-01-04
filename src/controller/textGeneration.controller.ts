import { Request, Response } from "express";
import  { Translation } from "../model/translation.model"; // Adjust path as needed
import jsPDF from "jspdf";
import fs from "fs";
import path from "path";
import { transliterateBanglishToBangla } from "../utils/transliteration"; // Assume this function exists
import multer from "multer";
import axios from "axios";

// Base64-encoded Bangla font (replace this with the full base64 string of a proper Bangla font)
const banglaFontBase64 = `data:font/ttf;base64,AAEAAA...`; // Replace with actual base64 string

export const transliterateController = async (req: Request, res: Response): Promise<void> => {
  const { banglishText, exportPdf } = req.body;

  if (!banglishText) {
    res.status(400).json({ error: "Banglish text is required" });
    return;
  }

  try {
    // Perform transliteration
    const banglaText = transliterateBanglishToBangla(banglishText);
    console.log(banglaText);

    
    // Save the transliteration record in the database
    const translation = new Translation({
      banglishText,
      banglaText,
    });
    await translation.save();

    res.status(200).json({
        banglishText,
        banglaText,
        _id: translation._id, // Return the ID of the saved document
      });
  } catch (error) {
    console.error("Error transliterating text:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const createTextFileController = async (req: Request, res: Response): Promise<void> => {
    const { banglishText, banglaText, translationId } = req.body;
  
    if (!banglishText || !banglaText || !translationId) {
      res.status(400).json({ error: "Banglish text, Bangla text, and translationId are required" });
      return;
    }
  
    try {
      // Step 1: Save the text data into a text file
      const textFileName = `transliteration_${translationId}.txt`;
      const textFilePath = path.join(__dirname, "../public/texts", textFileName);
      const textContent = `Banglish Text: ${banglishText}\nBangla Text: ${banglaText}`;
  
      // Create the directory if it doesn't exist
      fs.mkdirSync(path.dirname(textFilePath), { recursive: true });
  
      // Write the data to a text file
      fs.writeFileSync(textFilePath, textContent);
  
      // Step 2: Save data to the database
      const translation = new Translation({
        banglishText,
        banglaText,
        translationId,
        textFilePath,
      });
      await translation.save();
  
      // Step 3: Respond with the result
      res.status(200).json({
        message: "Text file generated and transliteration saved successfully",
        banglishText,
        banglaText,
        translationId,
        textFilePath: `/public/texts/${path.basename(textFilePath)}`,  // Return relative path for the frontend
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  const sanitizeForFilename = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric characters with underscores
      .slice(0, 50) // Limit length to 50 characters (optional)
      .trim(); // Remove trailing underscores
  };

  export const createTextFileAndPdfController = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { banglishText, banglaText, translationId } = req.body;
  
    if (!banglishText || !banglaText || !translationId) {
      res
        .status(400)
        .json({ error: "Banglish text, Bangla text, and translationId are required" });
      return;
    }
  
    try {
      // Step 1: Save the text data into a text file
      const textFileName = `transliteration_${translationId}.txt`;
      const textFilePath = path.join(__dirname, "../public/texts", textFileName);
      const textContent = `Banglish Text: ${banglishText}\nBangla Text: ${banglaText}`;
  
      // Create the directory if it doesn't exist
      fs.mkdirSync(path.dirname(textFilePath), { recursive: true });
  
      // Write the data to a text file
      fs.writeFileSync(textFilePath, textContent);
      const sanitizedBanglishText = sanitizeForFilename(banglishText);

      //const pdfFileName = `transliteration_${sanitizedBanglishText}_${translationId}.pdf`;
      
  
      // Step 2: Convert the text file content to a PDF file
      const pdfFileName = `transliteration_${translationId}.pdf`;
      console.log(pdfFileName);
      const pdfFilePath = path.join(__dirname, "../public/pdfs", pdfFileName);
  
      const doc = new jsPDF();
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(textContent, 170); // Format content for PDF
      doc.text(lines, 10, 20);
  
      // Save the PDF to the file system
      fs.mkdirSync(path.dirname(pdfFilePath), { recursive: true });
      doc.save(pdfFilePath);
  
      // Step 3: Save data to the database
      const translation = new Translation({
        banglishText,
        name:pdfFileName,
        banglaText,
        translationId,
        textFilePath,
        pdfFilePath,
      });
      await translation.save();
  
      // Step 4: Respond with the result
      res.status(200).json({
        message: "Text file and PDF generated and transliteration saved successfully",
        banglishText,
        banglaText,
        pdfFileName,
        translationId,
        textFilePath: `/public/texts/${path.basename(textFilePath)}`, // Return relative path for the frontend
        pdfFilePath: `/public/pdfs/${path.basename(pdfFilePath)}`, // Return relative path for the frontend
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const getAllTranslations = async (req: Request, res: Response): Promise<void> => {
    try {
      const translations = await Translation.find(); // Fetch all translations
      res.status(200).json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  export const getAllTextFilesController = (req: Request, res: Response): void => {
    try {
      // Define the path to the text files directory
      const textsDirectory = path.join(__dirname, '../public/texts');
  
      // Check if the directory exists
      if (!fs.existsSync(textsDirectory)) {
        res.status(404).json({ error: 'Texts directory not found.' });
        return;
      }
  
      // Read the contents of the directory
      const files = fs.readdirSync(textsDirectory);
  
      // Filter for .txt files
      const textFiles = files.filter((file) => file.endsWith('.txt'));
  
      // Map file details (name and relative path)
      const fileDetails = textFiles.map((file) => ({
        name: file,
        path: `/public/texts/${file}`, // Relative path for frontend access
      }));
  
      // Return the list of text files
      res.status(200).json({ files: fileDetails });
    } catch (error) {
      console.error('Error retrieving text files:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  export const searchTextFileByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.query; // Extract the search query from the URL
  
      if (!name) {
        return res.status(400).json({ success: false, message: "Text file name is required" });
      }
  
      // Search text files by name (case-insensitive)
      const textFiles = await Translation.find({ name: { $regex: name, $options: 'i' } });
  
      if (textFiles.length === 0) {
        return res.status(404).json({ success: false, message: "No text files found matching the query" });
      }
  
      res.status(200).json({ success: true, data: textFiles });
    } catch (error) {
      console.error("Error searching text files:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


// // Set up Multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // Helper function to detect language (Bengali or English)
// function detectLanguage(text: string) {
//   const banglaCharCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
//   const englishCharCount = (text.match(/[a-zA-Z]/g) || []).length;
//   return banglaCharCount > englishCharCount ? "Bengali" : "English";
// }

// const pdfParse = require('pdf-parse');


//   export const summarizer = async (req: Request, res: Response) => {
//     try {
//       const file = req.file;
  
//       // Validate file type
//       if (!file || path.extname(file.originalname).toLowerCase() !== ".pdf") {
//         return res.status(400).json({ message: "Only PDF files are allowed." });
//       }
  
//       // Read and extract text from the PDF
//       const dataBuffer = fs.readFileSync(file.path);
//       const pdfData = await pdfParse(dataBuffer);
//       const text = pdfData.text;
  
//       // Check if the extracted text is not empty
//       if (!text.trim()) {
//         return res.status(400).json({ message: "The PDF contains no extractable text." });
//       }
  
//       // Send the extracted text to the public summarization API
//       const response = await axios.post(
//         "https://2c29-34-55-190-23.ngrok-free.app/summarize",
//         { text }, // Sending the extracted text
//         { headers: { "Content-Type": "application/json" } }
//       );
  
//       // Clean up the uploaded file
//       fs.unlinkSync(file.path);
  
//       // Send the response back to the client
//       res.status(200).json({
//         message: "PDF summarized successfully",
//         language: response.data.language,
//         summary: response.data.summary,
//       });
//     } catch (error:any) {
//       console.error("Error:", error.message);
//       res.status(500).json({ message: "Internal server error", error: error.message });
//     }
//   };