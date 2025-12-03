import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const StatCard = ({ 
  title, 
  value, 
  change = null, 
  icon, 
  color = "blue",
  index = 0 
}) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600",
      lightBg: "from-blue-50 to-blue-100"
    },
    green: {
      bg: "from-green-500 to-green-600",
      text: "text-green-600",
      lightBg: "from-green-50 to-green-100"
    },
    yellow: {
      bg: "from-yellow-500 to-yellow-600",
      text: "text-yellow-600",
      lightBg: "from-yellow-50 to-yellow-100"
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      text: "text-purple-600",
      lightBg: "from-purple-50 to-purple-100"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Background Gradient */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
          colorClasses[color].bg
        )} />
        
        <Card.Content className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                {value}
              </p>
              {change && (
                <div className="flex items-center space-x-1">
                  <ApperIcon 
                    name={change.type === "increase" ? "TrendingUp" : "TrendingDown"} 
                    className={cn(
                      "w-4 h-4",
                      change.type === "increase" ? "text-green-600" : "text-red-600"
                    )}
                  />
                  <span className={cn(
                    "text-sm font-medium",
                    change.type === "increase" ? "text-green-600" : "text-red-600"
                  )}>
                    {change.value}
                  </span>
                </div>
              )}
            </div>
            
            <div className={cn(
              "w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center",
              colorClasses[color].lightBg
            )}>
              <ApperIcon name={icon} className={cn("w-6 h-6", colorClasses[color].text)} />
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  )
}

export default StatCard