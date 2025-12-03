import { useState, useEffect } from "react"
import attendanceService from "@/services/api/attendanceService"

const useAttendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadAttendance = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await attendanceService.getAll()
      setAttendance(data)
    } catch (err) {
      setError(err.message || "Failed to load attendance records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttendance()
  }, [])

  const recordAttendance = async (attendanceData) => {
    try {
      const newRecord = await attendanceService.create(attendanceData)
      setAttendance(prev => [...prev, newRecord])
      return newRecord
    } catch (err) {
      throw new Error(err.message || "Failed to record attendance")
    }
  }

  const recordBulkAttendance = async (attendanceRecords) => {
    try {
      const newRecords = await attendanceService.createBulk(attendanceRecords)
      setAttendance(prev => [...prev, ...newRecords])
      return newRecords
    } catch (err) {
      throw new Error(err.message || "Failed to record bulk attendance")
    }
  }

  const updateAttendance = async (id, attendanceData) => {
    try {
      const updatedRecord = await attendanceService.update(id, attendanceData)
      setAttendance(prev => prev.map(a => a.Id === parseInt(id) ? updatedRecord : a))
      return updatedRecord
    } catch (err) {
      throw new Error(err.message || "Failed to update attendance")
    }
  }

  const deleteAttendance = async (id) => {
    try {
      await attendanceService.delete(id)
      setAttendance(prev => prev.filter(a => a.Id !== parseInt(id)))
    } catch (err) {
      throw new Error(err.message || "Failed to delete attendance record")
    }
  }

  const getAttendanceByStudent = async (studentId) => {
    try {
      return await attendanceService.getByStudent(studentId)
    } catch (err) {
      throw new Error(err.message || "Failed to get student attendance")
    }
  }

  const getAttendanceByCourse = async (courseId) => {
    try {
      return await attendanceService.getByCourse(courseId)
    } catch (err) {
      throw new Error(err.message || "Failed to get course attendance")
    }
  }

  const getAttendancePercentage = async (studentId, courseId = null) => {
    try {
      return await attendanceService.getAttendancePercentage(studentId, courseId)
    } catch (err) {
      throw new Error(err.message || "Failed to calculate attendance percentage")
    }
  }

  const getLowAttendanceStudents = async (threshold = 75) => {
    try {
      return await attendanceService.getLowAttendanceStudents(threshold)
    } catch (err) {
      throw new Error(err.message || "Failed to get low attendance students")
    }
  }

  const getCourseAttendanceStats = async (courseId) => {
    try {
      return await attendanceService.getCourseAttendanceStats(courseId)
    } catch (err) {
      throw new Error(err.message || "Failed to get course attendance stats")
    }
  }

  return {
    attendance,
    loading,
    error,
    loadAttendance,
    recordAttendance,
    recordBulkAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudent,
    getAttendanceByCourse,
    getAttendancePercentage,
    getLowAttendanceStudents,
    getCourseAttendanceStats
  }
}

export default useAttendance