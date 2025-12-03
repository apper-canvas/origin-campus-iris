import React, { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const DataTable = ({
  data = [],
  columns = [],
  onEdit = null,
  onDelete = null,
  onView = null,
  loading = false,
  className = ""
}) => {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="animate-pulse">
          {/* Table Header Skeleton */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded w-24 animate-shimmer"></div>
              ))}
            </div>
          </div>
          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-slate-200">
              <div className="flex space-x-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded w-32 animate-shimmer"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border border-slate-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-slate-100"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <ApperIcon
                        name={
                          sortColumn === column.key
                            ? sortDirection === "asc"
                              ? "ChevronUp"
                              : "ChevronDown"
                            : "ArrowUpDown"
                        }
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedData.map((row, index) => (
              <motion.tr
                key={row.Id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="table-row-hover"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Eye"
                          onClick={() => onView(row)}
                        />
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => onEdit(row)}
                        />
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        />
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable