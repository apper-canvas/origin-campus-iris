import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
<div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-40"
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col flex-grow bg-primary-900 border-r border-primary-800 shadow-sm">
          <div className={`flex items-center flex-shrink-0 py-6 border-b border-primary-800 ${
            isCollapsed ? 'px-4 justify-center' : 'px-4'
          }`}>
            {isCollapsed ? (
              <ApperIcon name="GraduationCap" className="w-8 h-8 text-white" />
            ) : (
              <h1 className="text-xl font-bold text-white">Campus Hub</h1>
            )}
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                    isCollapsed 
                      ? 'justify-center px-3 py-3' 
                      : 'space-x-3 px-3 py-2'
                  } ${
                    isActive(item.path)
                      ? "text-white bg-primary-800"
                      : "text-primary-100 hover:text-primary-200 hover:bg-primary-800"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 bg-primary-700 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>

{/* Main content */}
      <motion.div 
        className="flex flex-col flex-1"
        animate={{ marginLeft: isCollapsed ? 64 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ marginLeft: 0 }}
      >
        <Header isCollapsed={isCollapsed} onToggleCollapse={toggleSidebar} />
        <main className="flex-1">
          <Outlet />
        </main>
      </motion.div>
    </div>
  )
}

export default Layout