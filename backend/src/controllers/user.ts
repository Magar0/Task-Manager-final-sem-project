import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserProfilePic,
} from "../repository/user";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const data = await getAllUsers();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }
  try {
    const data = await getUserById(id);
    if (!data) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

export const uploadUserProfilePic = async (req: Request, res: Response) => {
  const id = req.userId;
  if (!id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  const fileUrl = req.file.path;
  try {
    await updateUserProfilePic(id, fileUrl);
    res
      .status(200)
      .json({ message: "Profile picture uploaded successfully", fileUrl });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error uploading profile picture", error: err });
    console.error(err);
  }
};
