import mongoose, { Schema, Document , ObjectId} from "mongoose";


export interface ITranslation extends Document {
  userId:String;  
  email: string;
  name: string;
  banglishText: string;
  banglaText: string;
  textFilePath: string; // Store local file path for download
  pdfFilePath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TranslationSchema: Schema = new Schema({
  userId: { String },  
  email: { type: String},
  name: { type: String },
  banglishText: { type: String, required: true },
  banglaText: { type: String, required: true },
  pdfFilePath: { type: String },
  textFilePath: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Translation = mongoose.model<ITranslation>("Translation", TranslationSchema);
