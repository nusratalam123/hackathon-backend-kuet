import { Router } from "express";
import {
  userLogin,
  userSignup,
  getCurrentUser,
  logout
 
} from "../controller/auth.controller";
import { jwtAuth } from "../utils/jwt-auth";
import { jwtCheck } from "../utils/jwt-check";

const router = Router();

// register new user
router.post("/signup", userSignup);

// user login
router.post("/login", userLogin);

// Logged in user
router.get("/loggedIn", getCurrentUser);

// user logout
router.delete("/logout", logout);


export default router;
