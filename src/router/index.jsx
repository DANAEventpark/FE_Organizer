import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

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
  // Các route sẽ được thêm theo từng REQ:
  // { path: '/login', element: <LoginPage /> },
  // { path: '/dashboard', element: <DashboardPage /> },
  // { path: '/events/create', element: <CreateEventPage /> },
  // { path: '/events/:id/manage', element: <ManageEventPage /> },
])

export default router
