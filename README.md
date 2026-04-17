# 🛒 E-Commerce Dashboard

A full-stack admin dashboard for managing an e-commerce store, built with **Next.js 16**, **MongoDB**, and **Tailwind CSS**. Features JWT-based authentication, full CRUD for products and categories, real-time analytics charts, and comprehensive input validation.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://illustrious-halva-7e51f7.netlify.app/)

---

## ✨ Features

- **Authentication** — Register, login, and logout with JWT tokens stored in HTTP-only cookies
- **Route Protection** — Middleware-based guard that blocks access to all dashboard and API routes for unauthenticated users
- **Products Management** — Full CRUD (Create, Read, Update, Delete) with inline form and per-field validation
- **Categories Management** — Full CRUD with modal-based editing
- **Analytics Dashboard** — Stats cards (total products, out of stock, categories) and inventory distribution bar chart
- **Input Validation** — Client-side and server-side validation with clear error messages
- **Responsive Layout** — Sidebar navigation with collapsible menu, navbar with user actions

---

## 🛠 Tech Stack

| Layer        | Technology                                       |
| ------------ | ------------------------------------------------ |
| Framework    | [Next.js 16](https://nextjs.org/) (App Router)   |
| Language     | TypeScript                                       |
| Database     | [MongoDB](https://www.mongodb.com/) via Mongoose |
| Auth         | JWT (`jsonwebtoken`) + `bcryptjs`                |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/)      |
| UI Library   | [shadcn/ui](https://ui.shadcn.com/)              |
| Charts       | [Recharts](https://recharts.org/)                |
| Icons        | [Lucide React](https://lucide.dev/)              |
| Deployment   | [Netlify](https://www.netlify.com/)              |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **MongoDB** connection string (Atlas or local)

### 1. Clone the repository

```bash
git clone https://github.com/eslamibrahim30/e-commerce-dashboard-nextjs.git
cd e-commerce-dashboard-nextjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (no sidebar/navbar)
│   │   ├── login/           # Login page
│   │   └── register/        # Register page
│   ├── (dashboard)/         # Dashboard pages (with sidebar/navbar)
│   │   ├── page.tsx         # Home — analytics dashboard
│   │   ├── products/        # Products management page
│   │   ├── categories/      # Categories management page
│   │   └── layout.tsx       # Dashboard layout wrapper
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/       # POST /api/auth/login
│   │   │   ├── register/    # POST /api/auth/register
│   │   │   └── logout/      # POST /api/auth/logout
│   │   ├── products/        # GET, POST /api/products
│   │   │   └── [id]/        # PUT, DELETE /api/products/:id
│   │   ├── categories/      # GET, POST /api/categories
│   │   │   └── [id]/        # PUT, DELETE /api/categories/:id
│   │   └── stats/           # GET /api/stats
│   ├── globals.css
│   └── layout.tsx           # Root layout
├── components/
│   ├── DashboardLayout.tsx  # Sidebar + navbar wrapper
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Navbar.tsx           # Top navigation bar
│   ├── shared/              # Reusable components (table, button, etc.)
│   └── ui/                  # shadcn/ui primitives
├── lib/
│   ├── db.ts                # MongoDB connection
│   ├── jwt.ts               # JWT sign/verify helpers
│   ├── validation.ts        # Shared validation utilities
│   └── utils.ts             # General utilities
├── models/
│   ├── Product.ts           # Product Mongoose model
│   ├── Category.ts          # Category Mongoose model
│   └── users.ts             # User Mongoose model
├── interfaces/
│   └── users.ts             # User TypeScript interfaces
└── middleware.ts             # Route protection middleware
```

---

## 🔐 Authentication

Authentication uses **JWT tokens** stored in HTTP-only cookies.

| Endpoint              | Method | Description              |
| --------------------- | ------ | ------------------------ |
| `/api/auth/register`  | POST   | Create a new user        |
| `/api/auth/login`     | POST   | Login and receive a token |
| `/api/auth/logout`    | POST   | Clear the auth cookie    |

### Creating an Account

> **Note:** The login page does not include a link to the registration page. To create a new account, navigate directly to [`/register`](http://localhost:3000/register) in your browser. After registering, you will be redirected to the login page where you can sign in with your new credentials.

### Route Protection

The middleware (`src/middleware.ts`) protects **all routes by default**, except:

- `/login` and `/register` — public auth pages
- `/api/auth/*` — public auth API endpoints
- Static assets (`_next/static`, images, favicon)

Unauthenticated requests to any other route are redirected to `/login`.

---

## 📦 API Reference

### Products

| Endpoint              | Method | Description           |
| --------------------- | ------ | --------------------- |
| `/api/products`       | GET    | List all products     |
| `/api/products`       | POST   | Create a new product  |
| `/api/products/:id`   | PUT    | Update a product      |
| `/api/products/:id`   | DELETE | Delete a product      |

**Product fields:**

| Field         | Type     | Required | Constraints                        |
| ------------- | -------- | -------- | ---------------------------------- |
| `name`        | string   | ✅       | Cannot be empty                    |
| `description` | string   | ✅       | Cannot be empty                    |
| `price`       | number   | ✅       | Must be ≥ 0                        |
| `discount`    | number   | ❌       | Must be between 0 and 100 (%)      |
| `stock`       | number   | ❌       | Must be a non-negative integer     |
| `category`    | ObjectId | ✅       | Must reference an existing category |

### Categories

| Endpoint               | Method | Description            |
| ---------------------- | ------ | ---------------------- |
| `/api/categories`      | GET    | List all categories    |
| `/api/categories`      | POST   | Create a new category  |
| `/api/categories/:id`  | PUT    | Update a category      |
| `/api/categories/:id`  | DELETE | Delete a category      |

### Stats

| Endpoint      | Method | Description                                          |
| ------------- | ------ | ---------------------------------------------------- |
| `/api/stats`  | GET    | Get dashboard stats (total products, out of stock, total categories) |

---

## ✅ Validation

Validation is enforced at **three layers**:

1. **Client-side** — Inline form validation with per-field error messages and HTML `min`/`max`/`step` attributes
2. **Server-side API** — Explicit validation before database operations, returning structured error responses
3. **Database schema** — Mongoose validators as a final safety net

### Validation Rules

| Field      | Rule                                |
| ---------- | ----------------------------------- |
| Name       | Required, cannot be empty           |
| Description| Required, cannot be empty           |
| Price      | Required, cannot be negative        |
| Discount   | Must be between 0% and 100%        |
| Stock      | Must be a non-negative whole number |
| Category   | Required, must exist in database    |

---

## 📜 Available Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start the development server               |
| `npm run build`    | Build for production                       |
| `npm run start`    | Start the production server                |
| `npm run lint`     | Run ESLint                                 |

---

## 📄 License

This project is private and not licensed for public distribution.
