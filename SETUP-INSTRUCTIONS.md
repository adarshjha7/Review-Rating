# Fitness Books Reviews - Complete Setup Instructions

## Database Information

- **Database Type**: SQLite (single file database)
- **Location**: `backend/fitness_books.db`
- **No Installation Required**: SQLite is embedded, no separate database server needed
- **Sample Data**: Automatically creates sample books and reviews on first run

## Setup Steps for Local Machine

### 1. Prerequisites

```bash
# Install Node.js (version 18 or higher)
# Check if you have it:
node --version
npm --version
```

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd fitness-books-reviews

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Start the Application

```bash
# Start both frontend and backend together (RECOMMENDED)
npm run dev

# OR start them separately:
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run dev:frontend
```

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3002
- **Database**: `backend/fitness_books.db` (created automatically)

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'fitness',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table

```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  image_url TEXT,
  tags TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products (id),
  UNIQUE(product_id, username) -- Prevents duplicate reviews
);
```

## Sample Data (Auto-Created)

### Books:

1. Atomic Habits for Fitness - James Clear ($24.99)
2. The Complete Guide to Strength Training - Mike Matthews ($29.99)
3. Nutrition Timing for Athletes - Dr. Sarah Johnson ($22.50)
4. Mindful Movement: Yoga for Fitness - Emma Rodriguez ($19.99)
5. HIIT Training Revolution - Coach Marcus Williams ($26.99)
6. The Science of Recovery - Dr. Lisa Chen ($31.50)

### Sample Reviews:

- Pre-populated with 4 sample reviews
- Contains tags like "excellent", "helpful", "practical"
- Demonstrates the popular tags functionality

## File Structure

```
fitness-books-reviews/
├── backend/
│   ├── routes/
│   │   ├── products.js    # Product API endpoints
│   │   └── reviews.js     # Review API endpoints
│   ├── uploads/           # Uploaded review images
│   ├── database.js        # Database setup & sample data
│   ├── server.js          # Express server
│   └── package.json       # Backend dependencies
├── src/
│   ├── components/        # React components
│   ├── pages/            # React pages
│   ├── lib/              # Utilities & API client
│   └── ...
├── package.json          # Frontend dependencies & scripts
└── README.md
```

## Environment & Ports

- **Frontend Dev Server**: Port 8080 (Vite)
- **Backend API Server**: Port 3002 (Express)
- **Database**: SQLite file (no port needed)
- **Image Uploads**: Stored in `backend/uploads/`

## Troubleshooting

### Database Issues

```bash
# If database gets corrupted, delete and restart:
rm backend/fitness_books.db
npm run dev  # Will recreate with sample data
```

### Port Conflicts

```bash
# If ports are busy, kill processes:
lsof -ti:8080 | xargs kill -9  # Frontend
lsof -ti:3002 | xargs kill -9  # Backend
```

### Reset Everything

```bash
# Complete reset:
rm backend/fitness_books.db
rm -rf backend/uploads/*
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install && cd ..
npm run dev
```

## Production Deployment

### Build Frontend

```bash
npm run build
# Creates 'dist' folder with static files
```

### Deploy Backend

```bash
cd backend
npm start  # Production mode
```

### Serve Frontend

- Use nginx, Apache, or serve static files from Express
- Point to the 'dist' folder created by build

## Key Features Working

✅ Product listing with search  
✅ Individual product pages  
✅ Review submission (rating + text + images)  
✅ Image uploads & display  
✅ Popular tags from reviews  
✅ Duplicate review prevention  
✅ Real-time review counts  
✅ Responsive design

## Development Commands

```bash
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Start only frontend
npm run backend:dev      # Start only backend
npm run build           # Build for production
npm run typecheck       # Check TypeScript types
npm test                # Run tests
```

That's it! The app should work perfectly with these instructions.
