import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardPage from '@/pages/DashboardPage'
import ProductDetail from '@/pages/ProductDetail'


/**
 * Router Configuration — FE_Organizer
 * Quản lý tất cả các route của ứng dụng
 * Sử dụng: createBrowserRouter (React Router v7)
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
    path: '/dashboard',
    element: (
      <ProtectedRoute role="organizer">
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  },
  {
  path: '/events/:id',
  element: (
    <ProtectedRoute role="organizer">
      <ProductDetail />
    </ProtectedRoute>
  )
},
])

export default router
