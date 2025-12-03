import departmentsData from "@/services/mockData/departments.json"

let departments = [...departmentsData]

const departmentsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...departments]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const department = departments.find(d => d.Id === id)
    if (!department) {
      throw new Error("Department not found")
    }
    return { ...department }
  },

  async create(departmentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = (Math.max(...departments.map(d => parseInt(d.Id))) + 1).toString()
    const newDepartment = {
      Id: newId,
      ...departmentData
    }
    departments.push(newDepartment)
    return { ...newDepartment }
  },

  async update(id, departmentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = departments.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error("Department not found")
    }
    departments[index] = { ...departments[index], ...departmentData }
    return { ...departments[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = departments.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error("Department not found")
    }
    const deletedDepartment = departments.splice(index, 1)[0]
    return { ...deletedDepartment }
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return departments.filter(d => 
      d.name.toLowerCase().includes(lowerQuery) ||
      d.code.toLowerCase().includes(lowerQuery) ||
      d.description.toLowerCase().includes(lowerQuery)
    ).map(d => ({ ...d }))
  }
}

export default departmentsService