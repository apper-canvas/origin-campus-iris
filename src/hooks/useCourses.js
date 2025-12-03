import { useState, useEffect } from "react"
import coursesService from "@/services/api/coursesService"

const useCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await coursesService.getAll()
      setCourses(data)
    } catch (err) {
      setError(err.message || "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const createCourse = async (courseData) => {
    try {
      const newCourse = await coursesService.create(courseData)
      setCourses(prev => [...prev, newCourse])
      return newCourse
    } catch (err) {
      throw new Error(err.message || "Failed to create course")
    }
  }

  const updateCourse = async (id, courseData) => {
    try {
      const updatedCourse = await coursesService.update(id, courseData)
      setCourses(prev => prev.map(c => c.Id === parseInt(id) ? updatedCourse : c))
      return updatedCourse
    } catch (err) {
      throw new Error(err.message || "Failed to update course")
    }
  }

  const deleteCourse = async (id) => {
    try {
      await coursesService.delete(id)
      setCourses(prev => prev.filter(c => c.Id !== parseInt(id)))
    } catch (err) {
      throw new Error(err.message || "Failed to delete course")
    }
  }

  return {
    courses,
    loading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse
  }
}

export default useCourses