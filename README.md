# DANAEventpark - Organizer Frontend

This repository contains the Frontend dashboard application for **Organizers** within the DANAEventpark platform. It empowers event creators to manage events, track attendee statistics, and configure ticketing options.

## 🚀 Tech Stack
- **Library:** React (v19)
- **Build Tool:** Vite
- **Styling:** TailwindCSS (v4)
- **State Management:** Zustand
- **Routing:** React Router DOM

## 📁 Key Directories
- `src/components`: Reusable dashboard UI components.
- `src/pages`: Main dashboard views (e.g., Create Event, Analytics).
- `src/assets`: Static assets and styling files.

## 🛠️ Local Development Setup

1. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy the environment example file:
   ```bash
   cp .env.example .env
   ```
   *Update the `.env` file to properly point to the Backend API (e.g., `VITE_API_BASE_URL=http://127.0.0.1:8000`).*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will usually be available at `http://localhost:5174` (check the terminal output for the exact port).

## 📦 Build for Production
To create an optimized production build, run:
```bash
npm run build
```
The production-ready static files will be placed in the `dist` directory. Preview it locally with:
```bash
npm run preview
```
