import express from "express";
import { getUsers, getUser, uploadUserProfilePic } from "../controllers/user";
import authMiddleware from "../middleware/middleware";
import { upload } from "../middleware/multer";

const router = express.Router();
router.get("/", authMiddleware, getUsers);
router.get("/:id", getUser);
router.post(
  "/upload",
  authMiddleware,
  upload.single("profilePic"),
  uploadUserProfilePic
);

export default router;
