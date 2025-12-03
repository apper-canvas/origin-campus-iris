import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="FileQuestion" className="w-16 h-16 text-red-600" />
          </div>
          <div className="text-8xl font-bold bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent mb-4">
            404
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Link to="/">
            <Button variant="primary" icon="Home" className="w-full sm:w-auto">
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link to="/students">
              <Button variant="secondary" icon="GraduationCap" className="w-full sm:w-auto">
                Students
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="secondary" icon="BookOpen" className="w-full sm:w-auto">
                Courses
              </Button>
            </Link>
            <Link to="/faculty">
              <Button variant="secondary" icon="Users" className="w-full sm:w-auto">
                Faculty
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 bg-white rounded-lg border border-slate-200 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-4">
            If you believe this is an error, please contact the system administrator.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <span className="flex items-center">
              <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
              support@campushub.edu
            </span>
            <span className="flex items-center">
              <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
              (555) 123-4567
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound