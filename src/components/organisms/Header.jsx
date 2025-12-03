import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Header = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              CampusHub
            </span>
          </Link>

{/* Header content - navigation moved to sidebar */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-slate-800">Campus Hub</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="hidden sm:flex"
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
              className="hidden sm:flex"
            />
            
{/* Mobile sidebar toggle button */}
            <Button
              variant="ghost"
              size="sm"
              icon={isMobileMenuOpen ? "X" : "Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
{/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Campus Hub</h2>
              </div>
              <nav className="p-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-primary-700 bg-primary-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeMobileTab"
                        className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header