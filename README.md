# 🎨 Internship Applicant Management Dashboard (Frontend)

An enterprise-level admin web dashboard for managing internship applications, built with **Next.js 14 (App Router)**, **TypeScript**, and a dual **Pitch-Black Dark / Clean White Light Theme System**.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React 18 App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Design System with CSS Custom Properties
- **Fonts**: Google Fonts (**Plus Jakarta Sans** for UI & **Outfit** for Headings)
- **Icons**: Custom Modern SVG Vector Library (`/components/Icons.tsx`)
- **HTTP Client**: Axios (with Request Interceptor for JWT Authorization headers)
- **State Management**: React Context (`AuthContext` & `ThemeProvider`)

---

## ✨ Key Features & User Interface

1. **Dark Obsidian & Clean Light Theme Toggle**:
   - High-contrast Pitch Black (`#09090b`) dark theme with metallic silver accents.
   - Clean White (`#ffffff`) light theme with deep charcoal text.
   - Icon-only theme switcher button with `localStorage` preference persistence.

2. **Administrator Authentication**:
   - Login page (`/login`) integrated with JWT bearer token storage.
   - Session protection via global `AuthContext` and route guards in `AppLayout`.

3. **Dashboard Analytics (`/dashboard`)**:
   - Metric cards displaying Total Applicants and Status breakdowns (`Pending`, `Shortlisted`, `Accepted`, `Rejected`).
   - Visual progress bars showing percentage distribution across internship tracks (**Frontend**, **Backend**, **Mobile**, **UI/UX**, **Data Analytics**).
   - Recent candidate submission roster.

4. **Applicant Management (`/applicants`)**:
   - Real-time candidate search by name or email.
   - Filter dropdowns by Application Status and Internship Track.
   - Paginated candidate table with dynamic action controls.
   - Interactive `ApplicantModal` supporting:
     - **Profile Details**: View and update applicant details with automatic empty-string sanitization (preventing validation errors on optional fields like `resumeUrl`).
     - **Status Transitions**: Status updates with warning banners enforcing business rules (**Rejected → Accepted blocked**).
     - **Internal Notes**: Confidential admin evaluation notes with real-time character counter (1,000 char max).

5. **API Proxying & Documentation Rewrites**:
   - Next.js rewrite rules proxy `/docs` and `/api/docs` requests directly to backend Swagger UI.
   - Modern SVG vector icons with explicit CSS sizing utility classes (`w-4`, `w-5`, `w-6`) preventing layout distortion.

5. **Responsive Layout**:
   - Desktop sidebar navigation with active indicator states.
   - Mobile navigation drawer with backdrop overlay for smaller viewports.

---

## 📋 Prerequisites

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- Running NestJS backend instance (or Render deployed backend URL)

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the `/frontend` directory:

```env
# URL of your NestJS backend API instance
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Supabase Credentials (Optional for client integrations)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-placeholder
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3001` in your browser.

- **Default Admin Login Credentials**: `admin@intern.dev` / `Admin@1234`

---

## 🏗️ Production Build & Verification

To verify production compilation:
```bash
npm run build
npm run start
```

---

## 🌐 Production Deployment (Vercel)

This frontend repository is optimized for one-click deployment on [Vercel](https://vercel.com/):

1. Import the frontend repository into Vercel.
2. Configure **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Set to your deployed NestJS backend URL (e.g. `https://internship-backend.onrender.com/api`).
3. Deploy! Vercel will automatically use `vercel.json` and build your production bundle.

---

## 📄 License

UNLICENSED — Proprietary Internship Management System.
