import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./database.js";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "uploads", filename);
  res.sendFile(filepath);
});

await initDatabase();

app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
