# btwoc-store-managment — Project Summary

## Stack
- **Framework**: Next.js 16.2.10 (Turbopack) + TypeScript
- **Styling**: Tailwind v4 with `@theme` color tokens
- **Auth**: Firebase Phone Auth (RecaptchaVerifier → OTP) — client only; MongoDB is source of truth for users/roles
- **Database**: MongoDB Atlas via Mongoose (cached singleton in `lib/mongodb.ts`)
- **State**: Zustand (`useCartStore` persisted, `useInventoryStore` fetched from API)
- **UI Icons**: Hugeicons (free tier)

## Auth Flow
1. `Login page:` Enter phone → RecaptchaVerifier (invisible) → `signInWithPhoneNumber` → enter OTP → `confirmation.confirm(otp)` → redirect to `/shop`
2. `AuthContext:` `onAuthStateChanged` → upserts user via `POST /api/user` → sets `__session` + `uid` cookies for middleware
3. Role state derived from MongoDB doc: `isOwner = role===OWNER + ownerStatus===VERIFIED + status===ACTIVE`
4. `SidebarLayout` gates `/dashboard/*` with status-specific messages for PENDING/REJECTED/UNAUTHORIZED

## Data Models (MongoDB)
- **User**: uid, phone, name, role (CUSTOMER|OWNER), ownerStatus (NONE|PENDING|VERIFIED|REJECTED), status (ACTIVE|SUSPENDED), business fields
- **UserDetails**: Full onboarding data (business profile + store + documents + submission status)
- **Store**: name, tag, offeringCount, images, description, address, city, coverage, ownerUid
- **Product**: title, price, rating, type (item|service), image, storeId
- **Service**: title, price, rating, description, image, storeId, productCount, products[ObjectId]
- **Booking**: userId, title, price, date, time, image, status

## API Routes (11)
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/user` | GET, POST, PATCH | Find/upsert/update user; apply for ownership |
| `/api/user-details` | GET, POST, PATCH, DELETE | Owner onboarding CRUD |
| `/api/products` | GET, POST | List/create products |
| `/api/products/[id]` | GET, DELETE | Single product |
| `/api/services` | GET, POST | List/create services (populated) |
| `/api/services/[id]` | GET, DELETE | Single service |
| `/api/stores` | GET, POST | List/create stores |
| `/api/bookings` | GET, POST, PATCH | Bookings by userId |
| `/api/admin/users` | PATCH | Admin approve/reject owners |
| `/api/stats` | GET | Aggregate counts |
| `/api/seed` | POST | Seed sample data |

## 30 Page Routes
- `/` — Landing page (animated, 7 sections)
- `/login` — Phone → OTP auth
- `/shop` — Browse all products + services
- `/dashboard` — Main dashboard (hero, filters, product/store cards)
- `/dashboard/goods-products` — Product listings + create
- `/dashboard/services` — Service listings + create
- `/dashboard/stores` — Store grid + StoreManagerModal (CRUD)
- `/dashboard/store` — My Stores page (inline store listing)
- `/dashboard/store/create` — 3-step store creation wizard (submits to API)
- `/dashboard/store/profile` — Seller profile with owner status & Apply Now
- `/dashboard/bookings` — Bookings from API (real data)
- `/dashboard/cart` — Cart with items + bookings (Zustand persisted)
- `/dashboard/categories` — Category grid
- `/dashboard/profile` — Full profile + owner application
- `/dashboard/profile/payment` — Payment gateway (test keys)
- `/dashboard/settings` — Settings toggles (UI only)

## Components (14)
`Sidebar`, `BottomNav`, `SidebarLayout` (auth gate), `Modal`, `CartDrawer`, `HeroBanner`, `FilterBar`, `FilterRail`, `ProductCard`, `StoreCard`, `StoreManagerModal` (3-tab CRUD), `OwnerOnboarding` (4-step wizard), `MainLayout`, `OwnerOnboarding`

## Owner Flow
1. Profile page → "Apply Now" → OwnerOnboarding modal (4 steps)
2. Autosaves to UserDetails on step 0; final submit → `ownerStatus=PENDING`
3. Admin reviews via `PATCH /api/admin/users` → approve (OWNER+VERIFIED) or reject
4. Once approved, user sees dashboard content; can manage stores/products/services

## Middleware
- Cookie-based auth guard (`__session` + `uid` cookies)
- Public: `/`, `/login`, `/shop`, `/_next`, `/api`
- Customer: `/cart`, `/checkout`, `/orders`, `/bookings`, `/wishlist`, `/profile`
- Owner: `/dashboard/*`

## Recent Fixes (this session)
1. AuthContext now sets `__session` + `uid` cookies on login (for middleware)
2. `(pages)/layout.tsx` simplified — delegates auth to SidebarLayout
3. SidebarLayout deduplicated `setGateChecked(true)`
4. Store creation wizard submits to `/api/stores` (redirects to stores list)
5. Bookings page fetches from `/api/bookings?userId=X` (no mock data)
6. Added PATCH endpoint for booking cancellation
7. Placeholder pages (`/dashboard/store`, `/dashboard/store/profile`) replaced with real content
8. `MainLayout.tsx` fixed (`Children` → `children`)
9. Debug `console.log` removed from AuthContext
