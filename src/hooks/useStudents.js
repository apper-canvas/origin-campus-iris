import { useState, useEffect } from "react"
import studentsService from "@/services/api/studentsService"

const useStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await studentsService.getAll()
      setStudents(data)
    } catch (err) {
      setError(err.message || "Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const createStudent = async (studentData) => {
    try {
      const newStudent = await studentsService.create(studentData)
      setStudents(prev => [...prev, newStudent])
      return newStudent
    } catch (err) {
      throw new Error(err.message || "Failed to create student")
    }
  }

  const updateStudent = async (id, studentData) => {
    try {
      const updatedStudent = await studentsService.update(id, studentData)
      setStudents(prev => prev.map(s => s.Id === parseInt(id) ? updatedStudent : s))
      return updatedStudent
    } catch (err) {
      throw new Error(err.message || "Failed to update student")
    }
  }

  const deleteStudent = async (id) => {
    try {
      await studentsService.delete(id)
      setStudents(prev => prev.filter(s => s.Id !== parseInt(id)))
    } catch (err) {
      throw new Error(err.message || "Failed to delete student")
    }
  }

  return {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent
  }
}

export default useStudents