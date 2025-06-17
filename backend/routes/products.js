import express from "express";
import { db } from "../database.js";

const router = express.Router();

// Get all products with average ratings
router.get("/", async (req, res) => {
  try {
    const products = await db.all(`
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get single product with reviews
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.get(
      `
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `,
      [id],
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviews = await db.all(
      `
      SELECT * FROM reviews 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `,
      [id],
    );

    res.json({ ...product, reviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
