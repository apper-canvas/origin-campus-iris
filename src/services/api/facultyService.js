import facultyData from "@/services/mockData/faculty.json"

let faculty = [...facultyData]

const facultyService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...faculty]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const member = faculty.find(f => f.Id === parseInt(id))
    if (!member) {
      throw new Error("Faculty member not found")
    }
    return { ...member }
  },

  async create(facultyData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...faculty.map(f => f.Id)) + 1
    const newMember = {
      Id: newId,
      ...facultyData,
      joiningDate: facultyData.joiningDate || new Date().toISOString().split('T')[0]
    }
    faculty.push(newMember)
    return { ...newMember }
  },

  async update(id, facultyData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = faculty.findIndex(f => f.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Faculty member not found")
    }
    faculty[index] = { ...faculty[index], ...facultyData }
    return { ...faculty[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = faculty.findIndex(f => f.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Faculty member not found")
    }
    const deletedMember = faculty.splice(index, 1)[0]
    return { ...deletedMember }
  },

  async getByDepartment(departmentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return faculty.filter(f => f.departmentId === departmentId).map(f => ({ ...f }))
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return faculty.filter(f => 
      f.firstName.toLowerCase().includes(lowerQuery) ||
      f.lastName.toLowerCase().includes(lowerQuery) ||
      f.email.toLowerCase().includes(lowerQuery) ||
      f.specialization.toLowerCase().includes(lowerQuery)
    ).map(f => ({ ...f }))
  }
}

export default facultyService