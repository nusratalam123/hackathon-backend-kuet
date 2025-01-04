import { Router } from 'express';
import { getAllTranslations, 
    transliterateController ,
    createTextFileController,
    createTextFileAndPdfController,
    getAllTextFilesController,searchTextFileByName } from '../controller/textGeneration.controller';

const router: Router = Router();

import multer from "multer";
// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// POST route for translation
router.post('/translate', transliterateController );

router.post('/pdf', createTextFileController);

router.post('/pdfToTxt', createTextFileAndPdfController);

router.get('/all', getAllTranslations);

router.get('/all-txt-file', getAllTextFilesController);

// Route for searching text files by name
router.get('/search', searchTextFileByName);

// Route to upload recipe (text or image)
// router.post("/upload", upload.single('file'), summarizer );



export default router;
