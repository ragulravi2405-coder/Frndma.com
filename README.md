# Frndma — Modern 18+ Dating & Social Connection Platform ❤️

> **Real People • Genuine Connections ❤️**  
> Dedicated Official WhatsApp Support: **9087923641**

---

## 🌟 Overview

Frndma is a modern, production-grade 18+ dating and social connection platform. Designed with a dark romantic aesthetic, glowing neon accents, and ChatGPT-style simplicity, Frndma provides consenting adults with a safe and private space to meet, like, match, chat in real-time, and unlock verified contact information with explicit owner consent.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (App Router) + React
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Curated dark plum, crimson, and neon pink theme)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Real-Time Client:** Socket.IO Client
- **Responsive:** Mobile phones (iOS/Android), tablets, Windows laptops, desktop monitors

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js + TypeScript
- **Real-Time Gateway:** Socket.IO Server (rooms, typing indicators, online/offline presence, read receipts)
- **Database:** MongoDB Atlas / Mongoose ORM
- **Authentication:** bcrypt password hashing + JWT + HTTP-only cookies
- **Security:** Helmet, CORS, Express Rate Limiter, input validation (Zod)
- **Image Uploads:** Cloudinary SDK

### Payments & Monetization
- **Gateway:** Razorpay (Server-side order creation + HMAC SHA-256 signature verification + Webhooks)
- **Core Monetization:**
  - **Consent-Based Contact Unlock:** Unlocks contact information **only** when the profile owner has toggled `Contact Sharing: ON`.
  - **Subscription Plans:** Configurable tiers (Free ₹0, Premium ₹99/mo, Premium Plus ₹199/mo).

---

## 📁 Repository Structure

```text
frndma/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB, Cloudinary, Razorpay, ENV
│   │   ├── controllers/     # Auth, Profile, Discover, Likes, Matches, Messages, Payments, Admin, Support
│   │   ├── middleware/      # Auth, AdminAuth, RateLimiter, ErrorHandler, Validation
│   │   ├── models/          # User, Profile, Like, Match, Message, ContactUnlock, Payment, Plan, etc.
│   │   ├── routes/          # Express REST API routes
│   │   ├── sockets/         # Socket.IO chat gateway
│   │   ├── utils/           # Database seeding (admin, plans, demo users)
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── app/
    │   ├── (auth)/          # /login, /register, /forgot-password
    │   ├── profile/         # /profile, /profile/edit, /profile/[username]
    │   ├── discover/        # /discover (card browsing & filters)
    │   ├── likes/           # /likes (received likes with instant match)
    │   ├── matches/         # /matches (mutual matches)
    │   ├── messages/        # /messages, /messages/[matchId] (real-time chat)
    │   ├── pricing/         # /pricing (subscription tiers)
    │   ├── payments/        # /payments (transaction history & unlocked contacts)
    │   ├── dashboard/       # /dashboard (user metrics)
    │   ├── admin/           # /admin/login, /admin (dashboard, user moderation, reports, payments)
    │   ├── privacy/         # /privacy
    │   ├── terms/           # /terms
    │   ├── safety/          # /safety
    │   ├── community-guidelines/
    │   └── refund-policy/
    ├── components/          # Logo, Navbar, BottomNav, MatchModal, PaymentModal, WhatsAppSupport, etc.
    ├── lib/                 # API client, Socket instance, utilities
    ├── types/               # TypeScript definitions
    └── package.json
```

---

## ⚙️ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run build
npm run dev
```

* Backend runs on `http://localhost:5000`
* Health check: `http://localhost:5000/health`
* Default Admin seeded from ENV: Username `admin`, Password `AdminSecurePass@2026`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

* Frontend runs on `http://localhost:3000`

---

## 🔒 Key Privacy & Security Highlights

1. **Strict 18+ Age Gate:** Registration and site access require age confirmation.
2. **Consent-Based Contact Unlock:** Phone number is NEVER exposed without explicit toggle by the profile owner.
3. **No Exact Addresses:** Only city/state locations are stored and displayed.
4. **Backend Payment Verification:** Payments verified through cryptographic HMAC SHA-256 signatures before provisioning unlocks.
5. **Customer Support:** Verified WhatsApp assistance directly at **9087923641**.
