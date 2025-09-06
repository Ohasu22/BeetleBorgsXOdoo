# EcoFinds Backend API

A comprehensive Node.js backend API for the EcoFinds sustainable marketplace application, built with Express.js, MongoDB, and JWT authentication.

## Features

- 🔐 **Authentication System**: JWT-based auth with OTP verification
- 🛍️ **Product Management**: CRUD operations for marketplace items
- 🛒 **Shopping Cart**: Add, remove, and manage cart items
- 📦 **Order Management**: Complete order processing and history
- 📸 **Image Upload**: Support for product image uploads
- 🌱 **Eco Tracking**: CO₂ savings calculation for sustainable purchases
- 📊 **Analytics**: Order statistics and user insights

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + OTP verification
- **File Upload**: Multer
- **Email**: Nodemailer (with Ethereal for development)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BeetleBorgsXOdoo/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecofinds
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=4000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your system
   - Atlas: Update `MONGO_URI` with your Atlas connection string

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login (sends OTP)
- `POST /verify-otp` - Verify OTP and get JWT token

### Products (`/api/products`)
- `GET /` - Get all products (with filtering, pagination)
- `GET /:id` - Get single product
- `POST /` - Create new product (protected)
- `PUT /:id` - Update product (protected, owner only)
- `DELETE /:id` - Delete product (protected, owner only)
- `GET /user/my-listings` - Get user's products (protected)

### Cart (`/api/cart`)
- `GET /` - Get user's cart (protected)
- `POST /add` - Add item to cart (protected)
- `PUT /update/:itemId` - Update item quantity (protected)
- `DELETE /remove/:itemId` - Remove item from cart (protected)
- `DELETE /clear` - Clear entire cart (protected)
- `POST /checkout` - Process checkout (protected)

### Orders (`/api/orders`)
- `GET /` - Get user's order history (protected)
- `GET /:id` - Get single order (protected)
- `POST /` - Create new order (protected)
- `PUT /:id/status` - Update order status (protected, seller only)
- `GET /seller/orders` - Get orders for user's products (protected)
- `GET /stats` - Get order statistics (protected)

### Upload (`/api/upload`)
- `POST /image` - Upload single image (protected)
- `POST /images` - Upload multiple images (protected)
- `GET /:filename` - Serve uploaded images

## Database Models

### User
- `username`, `email`, `password` (hashed)
- `profileFields` (fullName, phone)
- Timestamps

### Product
- `title`, `description`, `price`, `category`, `condition`
- `images`, `seller` (User ref), `isActive`
- `co2Saved`, `location`, `tags`
- Timestamps

### Cart
- `user` (User ref), `items` (array of cart items)
- `totalItems`, `totalPrice`, `totalCO2Saved`
- Auto-calculated totals

### Order
- `orderNumber`, `buyer` (User ref), `items`
- `totalAmount`, `totalCO2Saved`, `status`
- `shippingAddress`, `paymentMethod`, `notes`
- Timestamps

### OTP
- `email`, `otpHash`, `expiresAt`
- `attempts`, `used`
- Auto-expires after 5 minutes

## Authentication Flow

1. **Registration/Login**: User provides credentials
2. **OTP Generation**: Server generates 6-digit OTP and sends via email
3. **OTP Verification**: User enters OTP, server validates and returns JWT
4. **Protected Routes**: Include JWT in Authorization header

## File Upload

- Images are stored in `/uploads` directory
- Supported formats: JPG, PNG, GIF, WebP
- Maximum file size: 5MB
- Multiple image upload supported (max 5 per request)

## Error Handling

- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging
- Global error handler for unhandled errors

## Development

### Project Structure
```
backend/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── uploads/         # Uploaded files
├── server.js        # Main application file
└── package.json     # Dependencies and scripts
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node test-conn.js` - Test MongoDB connection

### Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `SMTP_*` - Email configuration (optional)

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB
   - Set up proper SMTP for emails

2. **Security Considerations**
   - Use HTTPS in production
   - Implement rate limiting
   - Add input validation
   - Use environment variables for secrets

3. **Performance**
   - Enable MongoDB indexing
   - Implement caching
   - Use CDN for static files
   - Monitor and optimize queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.
