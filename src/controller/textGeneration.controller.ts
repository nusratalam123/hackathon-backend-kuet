import { Request, Response } from "express";
import  { Translation } from "../model/translation.model"; // Adjust path as needed
import jsPDF from "jspdf";
import fs from "fs";
import path from "path";
import { transliterateBanglishToBangla } from "../utils/transliteration"; // Assume this function exists

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
  
      // Step 2: Convert the text file content to a PDF file
      const pdfFileName = `transliteration_${translationId}.pdf`;
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