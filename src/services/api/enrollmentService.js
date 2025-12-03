import enrollmentsData from "@/services/mockData/enrollments.json"

let enrollments = [...enrollmentsData]

const enrollmentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...enrollments]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const enrollment = enrollments.find(e => e.Id === parseInt(id))
    if (!enrollment) {
      throw new Error("Enrollment not found")
    }
    return { ...enrollment }
  },

  async create(enrollmentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...enrollments.map(e => e.Id)) + 1
    const newEnrollment = {
      Id: newId,
      ...enrollmentData,
      enrollmentDate: enrollmentData.enrollmentDate || new Date().toISOString().split('T')[0],
      grade: enrollmentData.grade || "",
      status: enrollmentData.status || "enrolled"
    }
    enrollments.push(newEnrollment)
    return { ...newEnrollment }
  },

  async update(id, enrollmentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = enrollments.findIndex(e => e.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Enrollment not found")
    }
    enrollments[index] = { ...enrollments[index], ...enrollmentData }
    return { ...enrollments[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = enrollments.findIndex(e => e.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Enrollment not found")
    }
    const deletedEnrollment = enrollments.splice(index, 1)[0]
    return { ...deletedEnrollment }
  },

  async getByStudent(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return enrollments.filter(e => e.studentId === studentId).map(e => ({ ...e }))
  },

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return enrollments.filter(e => e.courseId === courseId).map(e => ({ ...e }))
  },

  async getBySemester(semester) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return enrollments.filter(e => e.semester === semester).map(e => ({ ...e }))
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return enrollments.filter(e => e.status === status).map(e => ({ ...e }))
  }
}

export default enrollmentService