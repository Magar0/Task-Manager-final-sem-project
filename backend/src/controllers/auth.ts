import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StringValue } from "ms";
import {
  checkEmailExists,
  checkUsernameExists,
  createUser,
} from "../repository/user";

config({ path: ".env" });

//token creation function
const createToken = ({
  email,
  name,
  username,
  userId,
  expiresIn = "1h",
}: {
  email: string;
  name: string;
  userId: string;
  username: string;
  expiresIn: StringValue | number;
}) => {
  const token = jwt.sign(
    { email, name, userId, username },
    process.env.JWT_SECRET!,
    {
      expiresIn,
    }
  );
  return token;
};
export const signup = async (req: Request, res: Response) => {
  const {
    name,
    username,
    email,
    password,
  }: { name: string; email: string; password: string; username: string } =
    req.body;
  if (!name || !email || !password || !username) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }
  try {
    // check if user already exists
    const existingUser = await checkEmailExists(email);
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }
    // check if username already taken
    const userNameExist = await checkUsernameExists(username);
    if (userNameExist) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await createUser({
      name,
      email,
      username,
      hashedPassword,
    });
    // JWT token creation
    const token = createToken({
      email,
      name,
      username,
      userId: newUser.id,
      expiresIn: "1hr",
    });
    res.status(201).json({
      data: { email, name, userId: newUser.id, username: newUser.username },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const existingUser = await checkEmailExists(email);
    if (!existingUser) {
      res.status(400).json({ message: "User doesn't exist" });
      return;
    }
    const isPasswordCrt = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCrt) {
      res.status(400).json({ message: "Password Wrong" });
      return;
    }
    const token = createToken({
      email,
      username: existingUser.username,
      name: existingUser.name,
      userId: existingUser.id,
      expiresIn: "1hr",
    });
    res.status(201).json({
      data: {
        email,
        name: existingUser.name,
        username: existingUser.username,
        userId: existingUser.id,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
