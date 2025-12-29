import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";

config({ path: ".env" });

// Extend the Request interface to include the userId property
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      io?: any;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("running auth middleware");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authorization token missing" });
      return;
    }

    // const decodedData= verify(token,process.env.JWT_SECRET)
    // req.userId= decodedData.userId;

    //alternate way
    verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (typeof decoded === "string" || !decoded?.userId) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        res.status(401).json({ message: "Token expired" });
        return;
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default authMiddleware;
