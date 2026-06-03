# DANAEventpark - Organizer Frontend

Welcome to the **Organizer Frontend** of DANAEventpark! This is the Admin Dashboard exclusively for **Event Organizers**. It provides powerful tools for creators to manage events, track revenue, and monitor attendee statistics.

## 🌟 Overview
Like the Attendee Frontend, this dashboard shares the same modern tech stack to ensure consistency and maintainability:
- **Framework/Library:** React (v19)
- **Build Tool:** Vite
- **CSS Framework:** TailwindCSS (v4)
- **State Management:** Zustand
- **API Client:** Axios

---

## 🏗 Folder Structure
Focus mainly on the `src/` directory:
- `src/pages/`: The core functional screens for organizers.
  - *Examples:* `DashboardPage.jsx` (Overview statistics), `MyEventsPage.jsx` (List of owned events), `ProductDetail.jsx` (Managing a specific event), `ProfilePage.jsx`.
- `src/components/`: Reusable dashboard UI pieces (Data Tables, Charts, Sidebar Menus, etc.).
- `src/assets/`: Static resources such as images and icons.

---

## 🔐 Advanced Authentication
Because this is an Admin Dashboard, the authentication flow is strict:
- Users MUST log in (`LoginPage.jsx`).
- Upon receiving a Token from the Backend, it is attached to the Header of every API request.
- If the Backend detects the user lacks the "Organizer" Role, it rejects the action (returning a 403 Forbidden error). Ensure you catch this error on the frontend to display appropriate messages.

---

## 🛠 Setup & Installation Guide

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration (.env):**
   Copy the template file to create your local environment settings:
   ```bash
   cp .env.example .env
   ```
   *Remember to point the environment variables to the correct Backend API (e.g., `VITE_API_BASE_URL=http://127.0.0.1:8000/api`).*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *Tip:* If you are running this simultaneously with `FE_Attendee` (which defaults to port `5173`), Vite is smart enough to automatically switch `FE_Organizer` to port `5174` or `5175`. Pay attention to the terminal output for the correct URL!

---

## 📦 Build for Production
To package the entire codebase for deployment to a live server:
```bash
npm run build
```
You can test the Production build locally by running:
```bash
npm run preview
```
