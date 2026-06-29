# 🛒 Vipani

**Vipani** is a full-stack MERN E-Commerce platform inspired by the Sanskrit word *"Vipani"* (Marketplace). The application provides a complete online shopping experience with secure authentication, payments, coupon management, wishlist, reviews, admin dashboard, low-stock alerts, and password recovery via email.

---

## ✨ Features

### 👤 User Features

- User Registration & Login (JWT Authentication)
- Forgot Password & Reset Password (Email Verification)
- Browse Products
- Product Search, Filter & Sorting
- Pagination
- Add to Cart
- Wishlist Management
- Product Reviews & Ratings
- Coupon Application
- Razorpay Payment Integration
- Order History & Order Tracking
- Responsive UI

---

### 🛠️ Admin Features

- Admin Dashboard
- Revenue Statistics
- Order Status Management
- Product CRUD Operations
- Coupon Management
- Low Stock Alerts
- Inventory Monitoring
- Recent Orders Section

---

## 🔐 Authentication Features

- JWT Authentication
- Protected Routes
- Admin Authorization Middleware
- Forgot Password using Nodemailer
- Secure Reset Token Generation using Crypto Module
- Password Reset Expiry (15 Minutes)

---

## 💳 Payment Features

- Razorpay Payment Gateway Integration
- Payment Verification using Signature Validation
- Order Payment Status Management

---

## 🎟️ Coupon System

- Percentage Coupons
- Fixed Amount Coupons
- Expiry Date Validation
- Minimum Order Amount Validation
- Enable/Disable Coupons
- Admin Coupon Management Panel

---

## 📦 Inventory Management

- Automatic Stock Reduction After Order Placement
- Stock Restoration on Order Cancellation
- Low Stock Alert System
- Custom Low Stock Threshold per Product

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Multer
- Nodemailer
- Crypto Module
- Razorpay

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Divyang-ce/Vipani.git
cd Vipani
```

---

### Backend Setup

```bash
cd server
npm install
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
```

---

## 📚 Concepts Implemented

This project helped in learning and implementing:

- JWT Authentication
- Role-Based Authorization
- Middleware in Express.js
- MongoDB Aggregation
- MongoDB `$expr` Operator
- REST API Design
- Payment Gateway Integration
- Email Services using Nodemailer
- Secure Token Generation using Crypto
- File Uploads using Multer
- State Management using React Context API
- Charts using Recharts
- CRUD Operations
- Pagination, Filtering & Sorting

---

## 🚀 Future Improvements

- Google OAuth Login
- Order Confirmation Emails
- User Profile Management
- Multiple Shipping Addresses
- Product Recommendations
- Dark Mode
- Mobile UI Enhancements
- Deployment using Vercel & Render

---

## 👨‍💻 Author

**Divyang Dudharejiya**

GitHub: https://github.com/Divyang-ce

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.
