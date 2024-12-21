import { Router } from "express";
import { createIngredient, getIngredients, updateIngredient ,updateIngredientQuantities} from "../controller/ingredient.controller";

const router = Router();
router.post("/add", createIngredient);
router.put("/single/:id", updateIngredient);
router.get("/all", getIngredients);
// Update ingredient quantities
router.put("/update-quantities", updateIngredientQuantities);

export default router;
