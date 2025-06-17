import sqlite3 from "sqlite3";
import { promisify } from "util";

const db = new sqlite3.Database("./fitness_books.db", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

const originalRun = db.run.bind(db);
const originalGet = db.get.bind(db);
const originalAll = db.all.bind(db);

db.run = promisify(originalRun);
db.get = promisify(originalGet);
db.all = promisify(originalAll);

export async function initDatabase() {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category TEXT NOT NULL DEFAULT 'fitness',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        image_url TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        UNIQUE(product_id, username)
      )
    `);

    const productCount = await db.get("SELECT COUNT(*) as count FROM products");
    if (productCount.count === 0) {
      await insertSampleProducts();
    }

    const reviewCount = await db.get("SELECT COUNT(*) as count FROM reviews");
    if (reviewCount.count === 0) {
      await insertSampleReviews();
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

async function insertSampleProducts() {
  const sampleProducts = [
    {
      title: "Atomic Habits for Fitness",
      author: "James Clear",
      description:
        "Transform your fitness journey with the power of small, consistent habits. Learn how to build lasting exercise routines and nutrition habits that stick.",
      image_url:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop",
      price: 24.99,
    },
    {
      title: "The Complete Guide to Strength Training",
      author: "Mike Matthews",
      description:
        "Master the fundamentals of strength training with this comprehensive guide covering proper form, progressive overload, and program design.",
      image_url:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop",
      price: 29.99,
    },
    {
      title: "Nutrition Timing for Athletes",
      author: "Dr. Sarah Johnson",
      description:
        "Optimize your performance with strategic nutrition timing. Learn when and what to eat to fuel your workouts and experience instead recovery .",
      image_url:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=600&fit=crop",
      price: 22.5,
    },
    {
      title: "Mindful Movement: Yoga for Fitness",
      author: "Emma Rodriguez",
      description:
        "Discover the fitness benefits of yoga with mindful movement practices that improve flexibility, strength, and mental clarity.",
      image_url:
        "https://up.yimg.com/ib/th?id=OIP.jVTIoWKboq-ecJwRQ4OyywHaE8&pid=Api&rs=1&c=1&qlt=95&w=149&h=99",
      price: 19.99,
    },
    {
      title: "HIIT Training Revolution",
      author: "Coach Marcus Williams",
      description:
        "Revolutionize your fitness with high-intensity interval training. 50+ workouts for maximum results in minimum time.",
      image_url:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      price: 26.99,
    },
    {
      title: "The Science of Recovery",
      author: "Dr. Lisa Chen",
      description:
        "Understand the science behind muscle recovery, sleep optimization, and injury prevention for peak athletic performance.",
      image_url:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=600&fit=crop",
      price: 31.5,
    },
  ];

  for (const product of sampleProducts) {
    await db.run(
      "INSERT INTO products (title, author, description, image_url, price) VALUES (?, ?, ?, ?, ?)",
      [
        product.title,
        product.author,
        product.description,
        product.image_url,
        product.price,
      ],
    );
  }

  console.log("Sample products inserted");
}

async function insertSampleReviews() {
  const sampleReviews = [
    {
      product_id: 1,
      username: "FitnessGuru",
      rating: 5,
      review_text:
        "This book is excellent and very helpful for beginners. Great practical advice!",
      tags: JSON.stringify(["excellent", "helpful", "practical", "great"]),
    },
    {
      product_id: 2,
      username: "StrengthTrainer",
      rating: 4,
      review_text:
        "Informative guide with effective workouts. Very motivational content.",
      tags: JSON.stringify(["informative", "effective", "motivation"]),
    },
    {
      product_id: 3,
      username: "HealthyEater",
      rating: 5,
      review_text:
        "Amazing nutrition advice. Excellent for understanding timing.",
      tags: JSON.stringify(["amazing", "excellent", "nutrition"]),
    },
    {
      product_id: 1,
      username: "BeginnerLifter",
      rating: 4,
      review_text:
        "Great book for beginners. Very easy to understand and helpful.",
      tags: JSON.stringify(["great", "helpful", "easy", "beginner"]),
    },
  ];

  for (const review of sampleReviews) {
    try {
      await db.run(
        "INSERT INTO reviews (product_id, username, rating, review_text, tags) VALUES (?, ?, ?, ?, ?)",
        [
          review.product_id,
          review.username,
          review.rating,
          review.review_text,
          review.tags,
        ],
      );
    } catch (error) {
      // Skip if review already exists (unique constraint)
      if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") {
        console.error("Error inserting sample review:", error);
      }
    }
  }

  console.log("Sample reviews inserted");
}

export { db };
