import coursesData from "@/services/mockData/courses.json"

let courses = [...coursesData]

const coursesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...courses]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const course = courses.find(c => c.Id === parseInt(id))
    if (!course) {
      throw new Error("Course not found")
    }
    return { ...course }
  },

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...courses.map(c => c.Id)) + 1
    const newCourse = {
      Id: newId,
      ...courseData,
      enrolled: courseData.enrolled || 0,
      prerequisites: courseData.prerequisites || []
    }
    courses.push(newCourse)
    return { ...newCourse }
  },

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    courses[index] = { ...courses[index], ...courseData }
    return { ...courses[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    const deletedCourse = courses.splice(index, 1)[0]
    return { ...deletedCourse }
  },

  async getByDepartment(departmentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return courses.filter(c => c.departmentId === departmentId).map(c => ({ ...c }))
  },

  async getBySemester(semester) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return courses.filter(c => c.semester === semester).map(c => ({ ...c }))
  },

  async getByFaculty(facultyId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return courses.filter(c => c.facultyId === facultyId).map(c => ({ ...c }))
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return courses.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.code.toLowerCase().includes(lowerQuery)
    ).map(c => ({ ...c }))
  }
}

export default coursesService