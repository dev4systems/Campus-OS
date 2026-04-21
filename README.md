# Nexus — Campus Management Portal

Nexus is a comprehensive campus management system designed for students, faculty, and administrators. It provides a centralized platform for academic records, timetable management, research collaboration, placement tracking, and system analytics.

## 🚀 Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, shadcn/ui
- **Backend/Database**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: TanStack Query (React Query)
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Maps**: Leaflet (OpenStreetMap)
- **Charts**: Recharts

## ✨ Key Features

- **Student Portal**: Dashboard with real-time stats, interactive timetable, attendance tracking, grade card downloads (PDF), fees management, and placement drive notifications.
- **Faculty Portal**: Subject management, student attendance marking, research request handling, and grade publishing.
- **Admin Portal**: User role management, academic infrastructure configuration, and a comprehensive Analytics Dashboard (DAU, feature usage, attendance health).
- **Security**: Robust RBAC (Role-Based Access Control) with Row Level Security (RLS) and database triggers to prevent role escalation.

## 🛠️ Local Development

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd nexus
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file based on `.env.example` and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    ```
    - `VITE_SUPABASE_URL`: Find this in Supabase Dashboard → Settings → API → Project URL.
    - `VITE_SUPABASE_PUBLISHABLE_KEY`: Find this in Supabase Dashboard → Settings → API → `anon` public API key.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🗄️ Database Migrations

To set up the database schema and security policies:
1. Navigate to the **SQL Editor** in your Supabase Dashboard.
2. Open the file `supabase/APPLY_TO_DASHBOARD.sql`.
3. Copy the entire content and paste it into the SQL Editor.
4. Run the query to create all tables, functions, and RLS policies.

## 🧪 Testing

- **Unit Tests**: `npm run test` (Runs Vitest)
- **E2E Tests**: `npx playwright test` (Requires Playwright browser installation)

## 🏗️ Architecture Overview

Nexus follows a decoupled architecture pattern:
- **Services**: Pure logic and Supabase client calls residing in `src/services/`.
- **Hooks**: Custom React hooks in `src/hooks/` that consume services via TanStack Query for caching and state management.
- **Pages**: UI components in `src/pages/` that utilize hooks to display data and interact with the system.

## ⚡ Performance

The application is highly optimized for fast initial loads:
- **Main app bundle**: 243KB (70KB gzipped)
- **Vendor chunks**: Large libraries like `framer-motion` and `@tanstack/react-query` are split into separate chunks for parallel loading.
- **Lazy Loading**: All pages are lazy-loaded via `React.lazy()`.
- **On-demand Assets**: `jsPDF` is loaded on-demand only when a user exports a PDF.
- **Total initial transfer**: ~400KB gzipped (industry standard for feature-rich SPAs).

## 🌐 Live Demo
