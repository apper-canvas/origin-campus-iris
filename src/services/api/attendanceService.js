import attendanceData from "@/services/mockData/attendance.json"

let attendance = [...attendanceData]

const attendanceService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...attendance]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const record = attendance.find(a => a.Id === parseInt(id))
    if (!record) {
      throw new Error("Attendance record not found")
    }
    return { ...record }
  },

  async create(attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...attendance.map(a => a.Id)) + 1
    const newRecord = {
      Id: newId,
      ...attendanceData,
      date: attendanceData.date || new Date().toISOString().split('T')[0]
    }
    attendance.push(newRecord)
    return { ...newRecord }
  },

  async createBulk(attendanceRecords) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newRecords = attendanceRecords.map(record => {
      const newId = Math.max(...attendance.map(a => a.Id)) + 1
      const newRecord = {
        Id: newId,
        ...record,
        date: record.date || new Date().toISOString().split('T')[0]
      }
      attendance.push(newRecord)
      return { ...newRecord }
    })
    return newRecords
  },

  async update(id, attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = attendance.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Attendance record not found")
    }
    attendance[index] = { ...attendance[index], ...attendanceData }
    return { ...attendance[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = attendance.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Attendance record not found")
    }
    const deletedRecord = attendance.splice(index, 1)[0]
    return { ...deletedRecord }
  },

  async getByStudent(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return attendance.filter(a => a.studentId === parseInt(studentId)).map(a => ({ ...a }))
  },

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return attendance.filter(a => a.courseId === parseInt(courseId)).map(a => ({ ...a }))
  },

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return attendance.filter(a => a.date === date).map(a => ({ ...a }))
  },

  async getBySemester(semester) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return attendance.filter(a => a.semester === semester).map(a => ({ ...a }))
  },

  async getAttendancePercentage(studentId, courseId = null) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    let studentRecords = attendance.filter(a => a.studentId === parseInt(studentId))
    if (courseId) {
      studentRecords = studentRecords.filter(a => a.courseId === parseInt(courseId))
    }
    
    if (studentRecords.length === 0) return 100 // No records means no absence
    
    const presentCount = studentRecords.filter(a => a.status === "present").length
    const totalCount = studentRecords.length
    
    return Math.round((presentCount / totalCount) * 100)
  },

  async getStudentAttendanceSummary(studentId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const studentRecords = attendance.filter(a => a.studentId === parseInt(studentId))
    
    if (studentRecords.length === 0) {
      return {
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        percentage: 100
      }
    }
    
    const presentCount = studentRecords.filter(a => a.status === "present").length
    const absentCount = studentRecords.filter(a => a.status === "absent").length
    const totalCount = studentRecords.length
    const percentage = Math.round((presentCount / totalCount) * 100)
    
    return {
      totalClasses: totalCount,
      presentCount,
      absentCount,
      percentage
    }
  },

  async getLowAttendanceStudents(threshold = 75) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const studentIds = [...new Set(attendance.map(a => a.studentId))]
    const lowAttendanceStudents = []
    
    for (const studentId of studentIds) {
      const percentage = await this.getAttendancePercentage(studentId)
      if (percentage < threshold) {
        const summary = await this.getStudentAttendanceSummary(studentId)
        lowAttendanceStudents.push({
          studentId,
          ...summary
        })
      }
    }
    
    return lowAttendanceStudents
  },

  async getCourseAttendanceStats(courseId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const courseRecords = attendance.filter(a => a.courseId === parseInt(courseId))
    
    if (courseRecords.length === 0) {
      return {
        totalClasses: 0,
        averageAttendance: 100,
        studentCount: 0
      }
    }
    
    const dates = [...new Set(courseRecords.map(a => a.date))]
    const students = [...new Set(courseRecords.map(a => a.studentId))]
    
    let totalPercentage = 0
    for (const studentId of students) {
      const percentage = await this.getAttendancePercentage(studentId, courseId)
      totalPercentage += percentage
    }
    
    const averageAttendance = students.length > 0 ? Math.round(totalPercentage / students.length) : 100
    
    return {
      totalClasses: dates.length,
      averageAttendance,
      studentCount: students.length
    }
  }
}

export default attendanceService