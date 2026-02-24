import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Volunteer Platform API Running 🚀");
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed ✅",
    user: req.user,
  });
});

app.get(
  "/organization-only",
  authMiddleware,
  roleMiddleware("ORGANIZATION"),
  (req, res) => {
    res.json({
      message: "Welcome organization user ✅",
      user: req.user,
    });
  }
);

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});