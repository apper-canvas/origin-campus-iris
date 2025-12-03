import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  type = "text", 
  className = "",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-slate-300 focus:border-primary-500 focus:ring-primary-500"

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        stateClasses,
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input