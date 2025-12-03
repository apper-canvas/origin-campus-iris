import { useState, useEffect } from "react"
import facultyService from "@/services/api/facultyService"

const useFaculty = () => {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadFaculty = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await facultyService.getAll()
      setFaculty(data)
    } catch (err) {
      setError(err.message || "Failed to load faculty")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFaculty()
  }, [])

  const createFaculty = async (facultyData) => {
    try {
      const newFaculty = await facultyService.create(facultyData)
      setFaculty(prev => [...prev, newFaculty])
      return newFaculty
    } catch (err) {
      throw new Error(err.message || "Failed to create faculty member")
    }
  }

  const updateFaculty = async (id, facultyData) => {
    try {
      const updatedFaculty = await facultyService.update(id, facultyData)
      setFaculty(prev => prev.map(f => f.Id === parseInt(id) ? updatedFaculty : f))
      return updatedFaculty
    } catch (err) {
      throw new Error(err.message || "Failed to update faculty member")
    }
  }

  const deleteFaculty = async (id) => {
    try {
      await facultyService.delete(id)
      setFaculty(prev => prev.filter(f => f.Id !== parseInt(id)))
    } catch (err) {
      throw new Error(err.message || "Failed to delete faculty member")
    }
  }

  return {
    faculty,
    loading,
    error,
    loadFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty
  }
}

export default useFaculty