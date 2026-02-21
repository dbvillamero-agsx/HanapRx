# HanapRx

Medicine finder web application for the Philippines. Search for medicines near you, compare prices across pharmacy branches, and check availability in real-time.

# App Preview

**WebApp**

<img width="623" height="865" alt="image" src="https://github.com/user-attachments/assets/8936084e-2856-42c9-9497-a847c8cc4f03" />
<img width="672" height="869" alt="image" src="https://github.com/user-attachments/assets/6fe02ebf-b860-4adf-ab73-1359ccce0fde" />
<img width="1058" height="864" alt="image" src="https://github.com/user-attachments/assets/821ef68a-fedc-4eeb-92e8-243dfafd4366" />
<img width="1091" height="867" alt="image" src="https://github.com/user-attachments/assets/1aec6ba8-0873-4e0a-98c9-0c3916ecf722" />
<img width="1092" height="863" alt="image" src="https://github.com/user-attachments/assets/c4197343-ab22-4005-9a97-aa849bda516a" />


**AdminApp**

<img width="1675" height="859" alt="image" src="https://github.com/user-attachments/assets/63fa75b2-f98f-446a-86be-65ddc6376465" />
<img width="1674" height="857" alt="image" src="https://github.com/user-attachments/assets/eb9555fd-9ffc-4e23-ad0b-b74da843b344" />
<img width="1679" height="850" alt="image" src="https://github.com/user-attachments/assets/c7af499f-5064-4d56-99b0-b3f9007ed8ce" />


## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v6, TanStack Query, Axios, Google Maps API

**Backend:** Node.js, Express 5, TypeScript, PostgreSQL, Prisma ORM, JWT Authentication, Zod validation

## Project Structure

```
HanapRx/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── routes/          # Router configuration
│   │   └── layouts/         # Layout components
│   └── ...
├── backend/                 # Express backend API
│   ├── prisma/              # Prisma schema and seed
│   └── src/
│       ├── controllers/     # Route handlers
│       ├── routes/          # Express route definitions
│       ├── services/        # Business logic
│       ├── middleware/       # Auth, validation, error handling
│       ├── schemas/         # Zod validation schemas
│       ├── utils/           # Haversine, pagination
│       └── config/          # Database and app config
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14 (or Docker)
- Google Maps API key (for map features)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd MedHanap
npm install          # installs concurrently
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Set up environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL and JWT secret

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your Google Maps API key
```

### 3. Set up the database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

The seed script creates:
- **Admin user:** admin@hanaprx.com / admin123
- 4 pharmacies (Mercury Drug, Watsons, Rose Pharmacy, South Star Drug)
- 10 branches across Metro Manila
- 12 common medicines
- ~96 inventory records with varied stock and prices

### 4. Start development servers

```bash
# From the root directory
npm run dev
```

This starts both servers:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Using Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

After the containers are running, seed the database:
```bash
docker compose exec backend npx prisma db seed
```

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/medicines/search?q=&lat=&lng=&sortBy=&availability=` | Search medicines |
| GET | `/api/medicines/autocomplete?q=` | Autocomplete suggestions |
| GET | `/api/medicines` | List all medicines |
| GET | `/api/medicines/:id` | Get medicine details |
| GET | `/api/branches` | List all branches |
| GET | `/api/branches/:id` | Get branch with inventory |
| GET | `/api/pharmacies` | List all pharmacies |
| GET | `/api/pharmacies/:id` | Get pharmacy with branches |
| GET | `/api/inventory` | List inventory records |

### Admin (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current user |
| POST/PUT/DELETE | `/api/pharmacies/:id` | CRUD pharmacies |
| POST/PUT/DELETE | `/api/branches/:id` | CRUD branches |
| POST/PUT/DELETE | `/api/medicines/:id` | CRUD medicines |
| POST/PUT/DELETE | `/api/inventory/:id` | CRUD inventory |

## Features

- **Medicine Search** - Debounced search with autocomplete, case-insensitive
- **Price Comparison** - Compare prices across pharmacy branches
- **Availability Status** - In Stock (>10), Low Stock (1-10), Out of Stock (0)
- **Distance Sorting** - Haversine formula for nearest branch calculation
- **Map View** - Google Maps with branch pins and user location
- **Admin Dashboard** - Full CRUD for pharmacies, branches, medicines, inventory
- **JWT Authentication** - Secure admin routes
- **Server-side Pagination** - All list endpoints paginated
- **Input Validation** - Zod schemas on all endpoints
- **Responsive Design** - Mobile-first layout
