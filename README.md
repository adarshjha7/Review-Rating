# Fitness Books Reviews

A full-stack web application for rating and reviewing fitness books. Users can browse a curated collection of fitness books, write reviews, submit ratings, and upload photos with their reviews.

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

### 🎨 Design Features

- Modern fitness-themed design with green and orange color palette
- Interactive star ratings
- Smooth animations and hover effects
- Card-based layouts with beautiful shadows
- Gradient backgrounds and buttons
- Clean typography and spacing

### 🔧 Technical Features

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
- **Lucide React**: Beautiful icon library
- **Sonner**: Toast notifications
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

## Key Features Implementation

### User Management

- Simple username-based system stored in localStorage
- No complex authentication needed
- Users identified by username for review tracking

### Review System

- Star ratings (1-5) with interactive UI
- Optional text reviews
- Optional photo uploads (5MB limit)
- Automatic tag extraction from review text
- Real-time average rating calculation

### Image Uploads

- Secure file upload with validation
- Image type checking (JPEG, JPG, PNG, GIF)
- File size limits (5MB)
- Unique filename generation with UUID

### Responsive Design

- Mobile-first design approach
- Responsive grid layouts
- Touch-friendly interactive elements
- Optimized for all screen sizes

## Customization

### Changing to MySQL

To switch from SQLite to MySQL:

1. Install MySQL driver:

   ```bash
   cd backend
   npm install mysql2
   ```

2. Update `backend/database.js`:

   ```javascript
   import mysql from "mysql2/promise";

   const connection = await mysql.createConnection({
     host: "localhost",
     user: "your_username",
     password: "your_password",
     database: "fitness_books",
   });
   ```

### Adding New Product Categories

Update the sample data in `backend/database.js` and modify the category validation as needed.

### Customizing the Theme

Modify the color palette in `tailwind.config.ts` and `src/index.css` to match your brand colors.

## Production Deployment

1. **Build the frontend**:

   ```bash
   npm run build
   ```

2. **Set up environment variables**:

   ```bash
   export PORT=3002
   export NODE_ENV=production
   ```

3. **Start the backend**:

   ```bash
   cd backend
   npm start
   ```

4. **Serve the frontend** using a static file server like nginx or serve the built files through your backend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
