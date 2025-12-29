import { Request } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./public/profile_pic",
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    cb(null, req.userId + path.extname(file.originalname)); // Use userId from request to name the file so if user uploads multiple times, it will overwrite the previous file
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const validImgTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/avif",
    ];
    if (!validImgTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only images are allowed. Valid types are: " +
            validImgTypes.join(", ")
        )
      );
    }
    cb(null, true);
  },
});
