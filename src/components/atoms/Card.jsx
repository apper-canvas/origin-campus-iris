import React from "react"
import { cn } from "@/utils/cn"

const Card = ({ children, className = "", hover = false }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-slate-200 shadow-sm",
        hover && "card-animate cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={cn("px-6 py-4 border-b border-slate-200", className)}>
      {children}
    </div>
  )
}

const CardContent = ({ children, className = "" }) => {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-200", className)}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card