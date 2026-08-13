# 🌲 Natours Expeditions - Frontend

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, high-performance outdoor expedition booking and adventure management web application built with **React 19**, **Vite 8**, **Tailwind CSS 4**, and **React Leaflet**. Designed with a signature vintage-explorer aesthetic featuring topographic patterns, ticket stubs, and passport stamp badges.

---

## ✨ Features

- 🏔️ **Curated Expeditions Catalog**: Explore outdoor tours with dynamic filtering by difficulty level, price range, ratings, and top 5 budget expeditions.
- 📍 **Interactive Route Mapping**: Embedded Leaflet map rendering expedition route coordinates, customized markers, and automated geographical bounding.
- 💳 **Razorpay Checkout Integration**: Secure online payment flow with verification handlers and confetti celebration feedback.
- 🔐 **Authentication & User Management**: Full JWT authentication state management with signup, login, password recovery, profile customization, and account deactivation.
- ✍️ **Adventurer Reviews**: Interactive review system enabling verified explorers to post, edit, and delete expedition feedback and star ratings.
- 🎫 **My Bookings Dashboard**: Manage reserved expedition passes with payment verification status and trail details.
- ⚙️ **Secure Environment Setup**: Centralized environment variable management via `.env` configuration.

---

## 🛠️ Tech Stack & Dependencies

- **Core Framework**: React 19, React DOM 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4, HeroUI, Lucide React Icons
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios with caching interceptors & retry handlers
- **Maps**: Leaflet 1.9, React Leaflet 5
- **Forms & Validation**: React Hook Form 7
- **Animations & Effects**: Canvas Confetti, Framer Motion

---

## 📁 Project Architecture

```text
natours-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # API client layer (axios instance, auth, tours, bookings, reviews)
│   ├── assets/             # Images and design assets
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Modals, toasts, empty states, spinners
│   │   ├── home/           # Hero section and features
│   │   └── tours/          # Cards, maps, review lists & forms, stamps
│   ├── config/             # Environment configuration (env.js)
│   ├── context/            # Auth context provider & state management
│   ├── hooks/              # Custom React hooks (useAuth, useBookTour, useRazorpay)
│   ├── pages/              # Application views (Home, Tours, Details, Profile, Bookings)
│   ├── App.jsx             # Root router layout setup
│   ├── index.css           # Global typography & Tailwind CSS directives
│   └── main.jsx            # Application entry point
├── .env                    # Local environment variables
├── .env.example            # Environment template file
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YogeshMahajanGit/natours-frontend.git
   cd natours-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Set your environment variables in `.env`:
   ```env
   VITE_API_BASE_URL=https://natours-api-906g.onrender.com/api/v1
   VITE_API_SERVER_URL=https://natours-api-906g.onrender.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev` - Starts the Vite local development server with HMR.
- `npm run build` - Compiles and bundles production-ready assets into the `dist` directory.
- `npm run preview` - Runs a local web server to preview the production build.
- `npm run lint` - Runs Oxlint to inspect source code for errors and formatting.

---

