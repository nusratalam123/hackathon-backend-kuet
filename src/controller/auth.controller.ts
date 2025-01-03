import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import User from "./../model/user.model";
import { generateToken, getBearerToken } from "./../utils/token";
import Blacklist from "../model/blacklist.model";

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirmPassword } = req.body;
   
    const user = await User.findOne({ email: email });

    if (user) {
      throw new Error("email already exist",)
    }
    console.log(password, confirmPassword) 
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const savedUser = await User.create(req.body);
    await savedUser.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "User signup successful",
    });
  } catch (err: any) {
    next(err)
  }
};

// user login
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide your credentials")
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No user found. Please create an account",)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Password is not correct")
    }

    if (!user.status) {
      throw new Error("The user is banned")
    }

    const token = generateToken({
      name: user.name,
      email: user.email,
    });

    const { password: pwd, ...info } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      data: {
        ...info,
        role: "user",
        token,
      },
    });
  } catch (err: any) {
    next(err)
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-expect-error because TypeScript doesn't know about the custom property
        const userName = req.authName;

        console.log(userName)
       
    
        if (!userName) {
          return res.status(403).json({ message: "User not authenticated" });
        }
    
        // Fetch user data from the database using userId
        const user = await User.find({name:userName}); // Assuming you have a User model
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json({ message: "Profile fetched successfully", user });
      } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
  };


  export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await getBearerToken(req);
      await Blacklist.create({ token: token });
  
      res.status(200).json({
        message: "Logout successful",
      });
    } catch (err: any) {
      next(err)
    }
  };