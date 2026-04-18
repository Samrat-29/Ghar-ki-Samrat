<div align="center">

<br/>

# 🏠 Ghar ki Samrat

### *The Ultimate Next-Generation Real Estate Platform for India*

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br/>

> **Finding a home shouldn't be tedious — it should be an organic, seamless experience.**

<br/>

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Made for India](https://img.shields.io/badge/Made%20for-🇮🇳%20India-ff9933)](https://github.com/)

</div>

---

## 📖 Overview

**Ghar ki Samrat** is an ultra-premium, AI-powered real estate web application designed specifically for the rapidly growing Indian property market. It delivers a true SaaS-grade user experience through sophisticated glassmorphism UI, buttery-smooth animations, and robust functionality — from intelligent AI-driven property recommendations to direct WhatsApp integrations with sellers.

By combining bleeding-edge web design with a lightweight dynamic server, Ghar ki Samrat is built to scale gracefully and perform beautifully.

---

## ✨ Features

### 🎨 Premium UI/UX
- **Glassmorphism Design** — Deeply integrated blur filtering and translucent surfaces throughout the UI
- **Cinematic Landing Page** — Full-screen responsive video hero that smoothly transitions into the core application
- **Micro-interactions** — Custom CSS transitions, hover animations, scroll-triggered loading via `IntersectionObserver`, and animated counter statistics

### 🧠 AI-Powered Ecosystem
- **Intelligent Semantic Search** — Leverages LLMs (Google Gemini / OpenRouter) to understand natural language queries like *"Show me 3BHK flats near Andheri under 2 Cr"*
- **Integrated AI Chatbot** — A floating interactive assistant that guides buyers directly through the property catalog

### 🔍 Advanced Property Discovery
- **Real-time Autocomplete** — Smart location input querying the local database with transparent fallback to the **OpenStreetMap Nominatim API** for comprehensive Indian city support
- **Dynamic Filtering** — Instantly isolate properties by budget, location, and specification

### 🔐 Secure Authentication
- **Strict Auth Funnel** — Protected routing enforcing a logical pipeline: `Landing → Login → Property App`
- **Session-Based Auth** — Fully functioning Express sessions to keep users logged in securely

### 📲 Frictionless Communication
- **1-Click WhatsApp** — Immediately launch WhatsApp Web/App pre-loaded with property context for direct seller negotiation
- **Native Call Intent** — Fast dialing integration optimised for mobile users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Styling** | Custom CSS + Tailwind CSS (CDN) |
| **Auth & Sessions** | `express-session`, Passport.js |
| **AI / LLM** | Google Gemini / OpenRouter |
| **Geocoding** | OpenStreetMap Nominatim API |
| **Data Layer** | Modular JSON (file I/O) |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
Ghar ki Samrat/
│
├── server.js                 # Core Express server & API routes
├── package.json              # Dependencies & scripts
│
├── data/                     # JSON database layer
│   ├── users.json            # Encrypted user accounts
│   ├── properties.json       # Property listings
│   ├── cart.json             # Wishlist/cart mapping
│   └── messages.json         # Contact form records
│
└── public/                   # Static client assets
    ├── landing.html          # Video-hero entry point & auth funnel
    ├── index.html            # Main authenticated SPA & dashboard
    ├── cart.html             # Wishlist management page
    ├── sell.html             # Seller property upload form
    ├── dashboard.html        # User profile & history
    ├── styles.css            # Master stylesheet (1,500+ lines)
    ├── app.js                # Core interactions & Fetch API logic
    └── auth.js               # Client-side routing & auth state
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine

### Installation

**1. Clone the repository**
```bash
git clone <repository_url>
cd "api based saas reeal estate web"
```

**2. Install dependencies**
```bash
npm install
```
This installs `express`, `express-session`, `axios`, `cors`, and `dotenv`.

**3. Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=3000
SESSION_SECRET=your_super_secret_key_here
OPENROUTER_API_KEY=your_openrouter_or_gemini_api_key_here
```

**4. Start the development server**
```bash
npm run dev
```

**5. Open the app**

Navigate to `http://localhost:3000` in your browser.

> ⚠️ **Important:** Do **not** use VS Code Live Server or Preview plugins. They intercept port routing and will break internal `/api` endpoints.

---

## 🔒 Routing & Auth Flow

Ghar ki Samrat enforces a strict, secure user pipeline:

```
🌐 Unauthenticated User
        │
        ▼
   Landing Page (/)
        │
        ▼
   Login / Register (/auth/login)
        │  Session cookie set
        ▼
   Main Platform (/home)
        │  Login UI hidden → Profile/Avatar shown
        ▼
   Protected Routes (Cart, Dashboard, Sell)
```

1. Unauthenticated users visiting `/home` are immediately redirected to the landing screen
2. Login is processed via `/auth/login`, saving state in an encrypted session cookie
3. Authenticated clients are routed to the main platform
4. The UI scrubs login controls post-authentication, yielding to user/avatar profile controls

---

## 🌐 API Endpoints (Overview)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate and create session |
| `POST` | `/auth/register` | Register a new user |
| `GET` | `/auth/logout` | Destroy session and redirect |
| `GET` | `/api/properties` | Fetch all property listings |
| `POST` | `/api/properties` | Add a new property listing |
| `GET` | `/api/cart` | Retrieve user's wishlist |
| `POST` | `/api/cart` | Add property to wishlist |
| `POST` | `/api/ai/search` | Natural language AI property search |
| `POST` | `/api/messages` | Submit contact/inquiry form |

---

## 🤝 Contributing

Contributions, issue reports, and feature requests are highly welcome!

We aim to build the definitive benchmark for SaaS-driven real estate platforms in India. To contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is **proprietary software** intended for production-grade real estate distribution. All rights reserved. See [`LICENSE`](./LICENSE) for complete terms.

---

<div align="center">

Built with ❤️ for the Indian real estate market

**Ghar ki Samrat** — *Where Every Home Finds Its King*

</div>