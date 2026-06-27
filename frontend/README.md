# SnapURL Frontend

A sleek, responsive, single-page application (SPA) frontend for the SnapURL service, built using React, TypeScript, Tailwind CSS, and ShadCN UI components. It adheres to a strict Gray & White (Zinc/Monochrome) theme and features clean layout sections for authenticating users and managing shortened URLs.

## 🚀 Features
- **Monochrome UI**: Built strictly with gray/white/zinc palette for a minimal, premium aesthetic.
- **Route Protection**: Implements custom `ProtectedRoute` and `PublicRoute` guards for secure client-side navigation.
- **URL Shortener Form**: Input with client-side Zod validation for correct URL formatting.
- **Links Dashboard**: Interactive ShadCN table displaying shortened URLs, original destinations, click counts, relative creation time, copy-to-clipboard actions, and external links.
- **State Management**: Zustand store to handle global authentication status and persist JWT access tokens in localStorage.
- **Smooth Feedbacks**: Employs skeleton loaders, empty illustrations, dynamic spinners, and clean success/destructive toast notifications.

## 🛠️ Tech Stack
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & class-variance-authority
- **UI Components**: ShadCN UI
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Manager**: Zustand
- **Form Handling**: React Hook Form + Zod resolvers
- **Icons**: Lucide React

---

## 📋 Prerequisites
- **Node.js** (v18.x or above)
- **npm** (v9.x or above)
- Running **SnapURL Backend** (default: `http://localhost:3000`)

---

## 🔧 Installation & Setup

1. **Clone and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root of the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

---

## 💻 Running the Application

### Development Mode
Start the Vite local development server:
```bash
npm run dev
```

### Production Build & Preview
Compile the project to static assets and preview the build:
```bash
npm run build
npm run preview
```

---

## 🤖 AI-Assisted Development Note
This frontend was built with the assistance of **Claude** (AI Assistant), utilizing advanced prompting and engineering workflows to ensure clean components, strict monochrome design compliance, and full type safety.
