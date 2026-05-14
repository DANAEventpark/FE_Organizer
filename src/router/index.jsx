import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/components/ProtectedRoute'

// Dummy component
const OrgDashboard = () => <div className="p-8 text-2xl font-bold">Organizer Dashboard</div>;

/**
 * Router Configuration — FE_Organizer
 * Quản lý tất cả các route của ứng dụng
 * Sử dụng: createBrowserRouter (React Router v7)
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute role="organizer">
        <OrgDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

export default router
