import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to display here yet.", 
  action = null,
  actionLabel = "Get Started",
  icon = "FileText",
  className = "" 
}) => {
  return (
    <div className={cn("min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50", className)}>
      <div className="text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-12 h-12 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
        
        {action && (
          <button
            onClick={action}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty