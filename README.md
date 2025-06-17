# Fitness Books Reviews

A full-stack web application for rating and reviewing fitness books. Users can browse a curated collection of fitness books, write reviews, submit ratings, and upload photos with their reviews.

## App is live on...
- **https://review-rating-system.netlify.app/**

## Features

### ✅ Core Features

- **Product Listing**: Browse a curated collection of fitness books with beautiful card layouts
- **Detailed Product Views**: View book details with cover images, descriptions, and all reviews
- **User Reviews**: Submit ratings (1-5 stars) and written reviews
- **Photo Uploads**: Upload images with your reviews
- **Review Tags**: Automatic keyword extraction from review text
- **Duplicate Prevention**: Users cannot review the same book twice
- **Average Ratings**: Real-time calculation of average ratings
- **Responsive Design**: Fully responsive across all device sizes


###  Technical Features

- **Frontend**: React 18 with TypeScript, React Router, TailwindCSS
- **Backend**: Node.js with Express.js
- **Database**: SQLite (easily changeable to MySQL)
- **UI Components**: Radix UI primitives with custom styling
- **File Uploads**: Multer for handling image uploads
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with toast notifications

## Tech Stack

### Frontend

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **React Router 6**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI primitives
- **React Query**: Server state management
- **Vite**: Fast development and build tool

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **SQLite**: Lightweight database (easily changeable to MySQL)
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique identifier generation

## Getting Started

### Live-Link
- **https://review-rating-system.netlify.app/**

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fitness-books-reviews
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start the application**

   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:8080) and backend (http://localhost:3002) simultaneously.

### Alternative Commands

```bash
# Start only frontend
npm run dev:frontend

# Start only backend
npm run backend:dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run typecheck
```

## API Endpoints

### Products

- `GET /api/products` - Get all products with average ratings
- `GET /api/products/:id` - Get single product with reviews

### Reviews

- `POST /api/reviews` - Submit a new review (with optional image upload)
- `GET /api/reviews/product/:productId` - Get reviews for a specific product
- `GET /api/reviews/can-review/:productId/:username` - Check if user can review

### Health

- `GET /api/health` - Health check endpoint

## Database Schema

### Products Table

- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT)
- `author` (TEXT)
- `description` (TEXT)
- `image_url` (TEXT)
- `price` (DECIMAL)
- `category` (TEXT)
- `created_at` (DATETIME)

### Reviews Table

- `id` (INTEGER PRIMARY KEY)
- `product_id` (INTEGER FOREIGN KEY)
- `username` (TEXT)
- `rating` (INTEGER 1-5)
- `review_text` (TEXT)
- `image_url` (TEXT)
- `tags` (TEXT JSON)
- `created_at` (DATETIME)
- `UNIQUE(product_id, username)` - Prevents duplicate reviews

### App Screenshots

![Screenshot (85)](https://github.com/user-attachments/assets/aa5d0c2f-1680-4292-8c03-6123f814ebca)

![Screenshot (86)](https://github.com/user-attachments/assets/218e170e-c31f-4a24-b9c9-c134b420b0c8)

![Screenshot (87)](https://github.com/user-attachments/assets/9cc8bc1b-95e1-40fe-8440-7e0dbb697673)

![Screenshot (88)](https://github.com/user-attachments/assets/1b6a21d8-7767-4dd4-99af-f4ea1eac5078)

![Screenshot (89)](https://github.com/user-attachments/assets/c393946c-5a80-4afa-bb42-1aa81fc69cfa)

