import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";
// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

// Lazy load page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Students = lazy(() => import("@/components/pages/Students"))
const Faculty = lazy(() => import("@/components/pages/Faculty"))
const Courses = lazy(() => import("@/components/pages/Courses"))
const Departments = lazy(() => import("@/components/pages/Departments"))
const Enrollment = lazy(() => import("@/components/pages/Enrollment"))
const Attendance = lazy(() => import("@/components/pages/Attendance"))
const Reports = lazy(() => import("@/components/pages/Reports"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>
  },
  {
    path: "students",
    element: <Suspense fallback={<LoadingFallback />}><Students /></Suspense>
  },
  {
    path: "faculty", 
    element: <Suspense fallback={<LoadingFallback />}><Faculty /></Suspense>
  },
  {
    path: "courses",
    element: <Suspense fallback={<LoadingFallback />}><Courses /></Suspense>
  },
  {
    path: "departments",
    element: <Suspense fallback={<LoadingFallback />}><Departments /></Suspense>
  },
  {
    path: "enrollment",
    element: <Suspense fallback={<LoadingFallback />}><Enrollment /></Suspense>
  },
  {
    path: "attendance",
    element: <Suspense fallback={<LoadingFallback />}><Attendance /></Suspense>
  },
  {
    path: "reports",
    element: <Suspense fallback={<LoadingFallback />}><Reports /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>
  }
]

// Create routes array with layout
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
]

export const router = createBrowserRouter(routes)