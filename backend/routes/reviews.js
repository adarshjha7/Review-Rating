import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database.js";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, true);
    }

    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  },
});

router.post(
  "/",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    console.log("Review submission request received");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    try {
      const { product_id, username, rating, review_text } = req.body;

      if (!product_id || !username || !rating) {
        console.log("Validation failed:", { product_id, username, rating });
        return res
          .status(400)
          .json({ error: "Product ID, username, and rating are required" });
      }

      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      }

      const existingReview = await db.get(
        "SELECT id FROM reviews WHERE product_id = ? AND username = ?",
        [product_id, username],
      );

      if (existingReview) {
        return res
          .status(409)
          .json({ error: "You have already reviewed this product" });
      }

      const tags = extractTags(review_text);
      console.log("Extracted tags:", tags);
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const tagsToStore = tags && tags.length > 0 ? JSON.stringify(tags) : null;
      console.log("Tags to store:", tagsToStore);

      try {
        const result = await db.run(
          `INSERT INTO reviews (product_id, username, rating, review_text, image_url, tags)
         VALUES (?, ?, ?, ?, ?, ?)`,
          [
            parseInt(product_id),
            username,
            parseInt(rating),
            review_text || null,
            imageUrl,
            tagsToStore,
          ],
        );

        console.log("Database result:", result);

        if (!result || typeof result.lastID === "undefined") {
          throw new Error("Database insert failed - no ID returned");
        }

        const newReview = await db.get("SELECT * FROM reviews WHERE id = ?", [
          result.lastID,
        ]);

        console.log("Retrieved review:", newReview);

        if (!newReview) {
          throw new Error("Failed to retrieve inserted review");
        }

        return res.status(201).json(newReview);
      } catch (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Database operation failed: ${dbError.message}`);
      }
    } catch (error) {
      console.error("Error creating review:", error);
      console.error("Error stack:", error.stack);

      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res
          .status(409)
          .json({ error: "You have already reviewed this product" });
      } else {
        return res.status(500).json({
          error: "Failed to create review",
          details: error.message,
        });
      }
    }
  },
);

router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await db.all(
      `
      SELECT * FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `,
      [productId],
    );

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.get("/can-review/:productId/:username", async (req, res) => {
  try {
    const { productId, username } = req.params;

    const existingReview = await db.get(
      "SELECT id FROM reviews WHERE product_id = ? AND username = ?",
      [productId, username],
    );

    res.json({ canReview: !existingReview });
  } catch (error) {
    console.error("Error checking review permission:", error);
    res.status(500).json({ error: "Failed to check review permission" });
  }
});

function extractTags(text) {
  if (!text || typeof text !== "string") return [];

  const commonFitnessKeywords = [
    "excellent",
    "great",
    "amazing",
    "helpful",
    "informative",
    "practical",
    "beginner",
    "advanced",
    "easy",
    "difficult",
    "comprehensive",
    "detailed",
    "motivation",
    "inspiring",
    "effective",
    "results",
    "workout",
    "exercise",
    "nutrition",
    "diet",
    "health",
    "strength",
    "cardio",
    "flexibility",
  ];

  try {
    const words = text.toLowerCase().split(/\W+/);
    const tags = words.filter(
      (word) => commonFitnessKeywords.includes(word) && word.length > 3,
    );

    return [...new Set(tags)].slice(0, 5); // Unique tags, max 5
  } catch (error) {
    console.error("Error extracting tags:", error);
    return [];
  }
}

export default router;
