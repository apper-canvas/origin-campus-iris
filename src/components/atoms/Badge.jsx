import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
  
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    primary: "bg-primary-100 text-primary-800 border-primary-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  }

  return (
    <span className={cn(baseClasses, variants[variant], className)}>
      {children}
    </span>
  )
}

export default Badge