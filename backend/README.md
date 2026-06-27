# SnapURL Backend

A robust, authenticated URL shortener backend built with Node.js, Express.js, TypeScript, and MongoDB. It implements a clean, flat folder architecture with strict interface-based decoupling for controllers, services, repositories, mappers, and middleware.

## 🚀 Features
- **User Authentication**: JWT-based login and registration.
- **URL Shortening**: Safe, collision-resistant custom base64url short codes.
- **Click Tracking**: Increments and stores request counts for each short URL.
- **Data Integrity**: Uses strict validation DTOs with class-validator.

## 🛠️ Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: jsonwebtoken & bcryptjs

---

## 📋 Prerequisites
- **Node.js** (v18.x or above)
- **npm** (v9.x or above)
- **MongoDB** running locally or a remote MongoDB Atlas URI

---

## 🔧 Installation & Setup

1. **Clone and navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root of the backend directory using `.env.example` as a reference:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` as required:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRY=7d
   BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```

---

## 💻 Running the Application

### Development Mode
Runs the server with hot-reload support using `ts-node-dev`:
```bash
npm run dev
```

### Production Build & Run
Build the TypeScript files to JavaScript and start the server:
```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

All responses follow this JSON envelope:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { }
}
```

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| **POST** | `/api/auth/register` | ❌ Public | Register a new user with email and password |
| **POST** | `/api/auth/login` | ❌ Public | Login, returns user details and JWT access token |
| **POST** | `/api/urls` | ✅ JWT | Create a shortened URL |
| **GET** | `/api/urls` | ✅ JWT | Fetch all shortened URLs created by the logged-in user |
| **GET** | `/r/:shortCode` | ❌ Public | Redirect to the original URL and increment click count |

---

## 🤖 AI-Assisted Development Note
This backend was built with the assistance of **Claude** (AI Assistant), utilizing advanced prompting and engineering workflows to ensure high-quality software architecture, strict layered structure, and complete type safety.
