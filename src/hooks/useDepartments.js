import { useState, useEffect } from "react"
import departmentsService from "@/services/api/departmentsService"

const useDepartments = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDepartments = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await departmentsService.getAll()
      setDepartments(data)
    } catch (err) {
      setError(err.message || "Failed to load departments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const createDepartment = async (departmentData) => {
    try {
      const newDepartment = await departmentsService.create(departmentData)
      setDepartments(prev => [...prev, newDepartment])
      return newDepartment
    } catch (err) {
      throw new Error(err.message || "Failed to create department")
    }
  }

  const updateDepartment = async (id, departmentData) => {
    try {
      const updatedDepartment = await departmentsService.update(id, departmentData)
      setDepartments(prev => prev.map(d => d.Id === id ? updatedDepartment : d))
      return updatedDepartment
    } catch (err) {
      throw new Error(err.message || "Failed to update department")
    }
  }

  const deleteDepartment = async (id) => {
    try {
      await departmentsService.delete(id)
      setDepartments(prev => prev.filter(d => d.Id !== id))
    } catch (err) {
      throw new Error(err.message || "Failed to delete department")
    }
  }

  return {
    departments,
    loading,
    error,
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
}

export default useDepartments