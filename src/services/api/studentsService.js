import studentsData from "@/services/mockData/students.json"

let students = [...studentsData]

const studentsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...students]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const student = students.find(s => s.Id === parseInt(id))
    if (!student) {
      throw new Error("Student not found")
    }
    return { ...student }
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...students.map(s => s.Id)) + 1
    const newStudent = {
      Id: newId,
      ...studentData,
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      gpa: studentData.gpa || 0.0
    }
    students.push(newStudent)
    return { ...newStudent }
  },

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = students.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Student not found")
    }
    students[index] = { ...students[index], ...studentData }
    return { ...students[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = students.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Student not found")
    }
    const deletedStudent = students.splice(index, 1)[0]
    return { ...deletedStudent }
  },

  async getByDepartment(departmentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return students.filter(s => s.departmentId === departmentId).map(s => ({ ...s }))
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return students.filter(s => s.status === status).map(s => ({ ...s }))
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return students.filter(s => 
      s.firstName.toLowerCase().includes(lowerQuery) ||
      s.lastName.toLowerCase().includes(lowerQuery) ||
      s.email.toLowerCase().includes(lowerQuery)
    ).map(s => ({ ...s }))
  }
}

export default studentsService