import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import useCourses from "@/hooks/useCourses"
import useDepartments from "@/hooks/useDepartments"
import useFaculty from "@/hooks/useFaculty"
import DataTable from "@/components/organisms/DataTable"
import SearchBar from "@/components/molecules/SearchBar"
import Modal from "@/components/molecules/Modal"
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"

const Courses = () => {
  const { courses, loading, error, loadCourses, createCourse, updateCourse, deleteCourse } = useCourses()
  const { departments } = useDepartments()
  const { faculty } = useFaculty()
  const [searchTerm, setSearchTerm] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: "",
    departmentId: "",
    semester: "",
    capacity: "",
    facultyId: "",
    schedule: "",
    prerequisites: ""
  })

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSemester = !semesterFilter || course.semester === semesterFilter
    
    return matchesSearch && matchesSemester
  })

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.Id === departmentId)
    return department ? department.name : "Unknown"
  }

  const getFacultyName = (facultyId) => {
    const member = faculty.find(f => f.Id === parseInt(facultyId))
    return member ? `${member.firstName} ${member.lastName}` : "Unassigned"
  }

  const getCapacityStatus = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100
    if (percentage >= 90) return { variant: "danger", text: "Full" }
    if (percentage >= 70) return { variant: "warning", text: "High" }
    return { variant: "success", text: "Available" }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits.toString(),
      departmentId: course.departmentId,
      semester: course.semester,
      capacity: course.capacity.toString(),
      facultyId: course.facultyId,
      schedule: course.schedule,
      prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(", ") : ""
    })
    setIsModalOpen(true)
  }

  const handleDelete = (course) => {
    setDeleteConfirmation(course)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        capacity: parseInt(formData.capacity),
        prerequisites: formData.prerequisites.split(",").map(p => p.trim()).filter(p => p)
      }

      if (editingCourse) {
        await updateCourse(editingCourse.Id, courseData)
        toast.success("Course updated successfully!")
      } else {
        await createCourse(courseData)
        toast.success("Course created successfully!")
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation) return
    
    try {
      await deleteCourse(deleteConfirmation.Id)
      toast.success("Course deleted successfully!")
      setDeleteConfirmation(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setEditingCourse(null)
    setFormData({
      code: "",
      name: "",
      credits: "",
      departmentId: "",
      semester: "",
      capacity: "",
      facultyId: "",
      schedule: "",
      prerequisites: ""
    })
  }

  const columns = [
    {
      key: "code",
      label: "Course",
      sortable: true,
      render: (_, course) => (
        <div>
          <p className="font-medium text-slate-900">{course.code}</p>
          <p className="text-sm text-slate-600">{course.name}</p>
        </div>
      )
    },
    {
      key: "departmentId",
      label: "Department",
      sortable: true,
      render: (departmentId) => getDepartmentName(departmentId)
    },
    {
      key: "facultyId",
      label: "Faculty",
      sortable: true,
      render: (facultyId) => getFacultyName(facultyId)
    },
    {
      key: "semester",
      label: "Semester",
      sortable: true
    },
    {
      key: "credits",
      label: "Credits",
      sortable: true,
      render: (credits) => (
        <span className="font-medium text-slate-900">{credits}</span>
      )
    },
    {
      key: "capacity",
      label: "Enrollment",
      sortable: true,
      render: (_, course) => {
        const status = getCapacityStatus(course.enrolled, course.capacity)
        return (
          <div className="text-center">
            <p className="text-sm font-medium text-slate-900">
              {course.enrolled}/{course.capacity}
            </p>
            <Badge variant={status.variant} className="text-xs">
              {status.text}
            </Badge>
          </div>
        )
      }
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadCourses} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Courses Management
              </h1>
              <p className="text-slate-600 mt-1">Manage course catalog and schedules</p>
            </div>
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="mt-4 sm:mt-0"
            >
              Add Course
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <Card.Content className="py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <Select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="sm:w-48"
                >
                  <option value="">All Semesters</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                </Select>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Courses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredCourses.length === 0 ? (
            <Empty
              title="No courses found"
              description="Start by adding your first course to the catalog."
              action={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              actionLabel="Add First Course"
              icon="BookOpen"
            />
          ) : (
            <DataTable
              data={filteredCourses}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Add/Edit Course Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title={editingCourse ? "Edit Course" : "Add New Course"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Course Code" required>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CS101"
                  required
                />
              </FormField>

              <FormField label="Course Name" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Credits" required>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Capacity" required>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Department" required>
                <Select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.Id} value={dept.Id}>{dept.name}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Faculty" required>
                <Select
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculty.map((member) => (
                    <option key={member.Id} value={member.Id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Semester" required>
                <Select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                </Select>
              </FormField>

              <FormField label="Schedule">
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="e.g., MWF 10:00-11:00 AM"
                />
              </FormField>

              <FormField label="Prerequisites" className="md:col-span-2">
                <Input
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  placeholder="Comma-separated list (e.g., MATH101, CS100)"
                />
              </FormField>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingCourse ? "Update Course" : "Add Course"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title="Delete Course"
          message={`Are you sure you want to delete ${deleteConfirmation?.code} - ${deleteConfirmation?.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      </div>
    </div>
  )
}

export default Courses