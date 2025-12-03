import React, { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import ApperIcon from "@/components/ApperIcon"

const Layout = () => {
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", path: "/", icon: "BarChart3" },
    { name: "Students", path: "/students", icon: "GraduationCap" },
    { name: "Faculty", path: "/faculty", icon: "Users" },
    { name: "Courses", path: "/courses", icon: "BookOpen" },
    { name: "Departments", path: "/departments", icon: "Building" },
    { name: "Enrollment", path: "/enrollment", icon: "UserPlus" },
    { name: "Attendance", path: "/attendance", icon: "UserCheck" },
    { name: "Reports", path: "/reports", icon: "FileText" }
  ]

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 shadow-sm">
          <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">Campus Hub</h1>
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-primary-700 bg-primary-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout