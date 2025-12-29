import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";
import userRoutes from "./routes/user";
import notificationRoutes from "./routes/notification";
import authMiddleware from "./middleware/middleware";

const app = express();
app.use("/public", express.static("public")); // Serve static files from the public directory

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  connectionStateRecovery: {},
});

// socket io connection3
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join-user-room", (userId: string) => {
    socket.join(`user-${userId}`);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "This is a Todo app backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/task", authMiddleware, taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notification", authMiddleware, notificationRoutes);

app.use("/", (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json("Something Went Wrong");
});

server.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
