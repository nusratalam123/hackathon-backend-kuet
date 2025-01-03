import { NextFunction, Request, Response } from "express";
import { getBearerToken, verifyToken } from "./token";
import Blacklist from "../model/blacklist.model";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";

// jwt bearer token
export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  if (
    req.path.endsWith("/login") ||
    req.path.endsWith("/signup") ||
    req.path.match(/^\/api\/v1\/text\/.+/) || // PRODUCT REGEX
    req.path.match(/^\/api\/v1\/chat\/.+/) || // PRODUCT REGEX

    !req.path.includes("/api/v1")
  ) {
    next();
    return;
  }

  try {
    const isTokenExist = await verifyToken(req);
    if (!isTokenExist) {
      throw new Error("Unauthorized");
    }

    const token = await getBearerToken(req);
    jwt.verify(token, secrets.jwt_secret, (err: any) => {
      if (err) {
        throw new Error("Forbidden");
      }
    });

    const isRevoked = await Blacklist.find({ token: token });
    if (isRevoked.length != 0) {
      throw new Error("Revoked");
    }

    // save auth info in request object
    saveAuthInfo(req, token);
    next();
  } catch (err: any) {
    return res.status(403).json({
      message: err.message,
    });
  }
}

/**
 * decrpty the header authorization token and save
 * the info in request object. later that info can be used
 */
async function saveAuthInfo(req: Request, token?: string) {
  try {
    if (!token) {
      return;
    }

    const payload = jwt.decode(token);

    // setting req data
    //@ts-expect-error
    req.authName = payload.name;
    //@ts-expect-error
    console.log(req.authName)

    //@ts-expect-error
    req.email = payload.email;
  } catch (error) {
    throw error;
  }
}
