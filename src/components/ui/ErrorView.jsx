import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry = null, 
  className = "" 
}) => {
  return (
    <div className={cn("min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50", className)}>
      <div className="text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {error}
          </p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
            Try Again
          </button>
        )}
        
        <p className="text-sm text-slate-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}

export default ErrorView