import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className = "", rows = 5 }) => {
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50", className)}>
      <div className="space-y-6 p-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-64 animate-shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-96 animate-shimmer"></div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 animate-shimmer"></div>
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2 animate-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 animate-shimmer"></div>
          </div>
          <div className="divide-y divide-slate-200">
            {[...Array(rows)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center space-x-6">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24 animate-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32 animate-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48 animate-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20 animate-shimmer"></div>
                <div className="flex-1"></div>
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20 animate-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading