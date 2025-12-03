import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { toast } from "react-toastify"
import useStudents from "@/hooks/useStudents"
import useCourses from "@/hooks/useCourses"
import DataTable from "@/components/organisms/DataTable"
import SearchBar from "@/components/molecules/SearchBar"
import Modal from "@/components/molecules/Modal"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import enrollmentService from "@/services/api/enrollmentService"

const Enrollment = () => {
  const { students } = useStudents()
  const { courses } = useCourses()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    semester: "",
    status: "enrolled"
  })

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await enrollmentService.getAll()
      setEnrollments(data)
    } catch (err) {
      setError(err.message || "Failed to load enrollments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId))
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student"
  }

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.Id === parseInt(courseId))
    return course ? `${course.code} - ${course.name}` : "Unknown Course"
  }

  const getStatusBadge = (status) => {
    const variants = {
      enrolled: "primary",
      completed: "success",
      dropped: "danger"
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    const studentName = getStudentName(enrollment.studentId)
    const courseName = getCourseName(enrollment.courseId)
    
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || enrollment.status === statusFilter
    const matchesSemester = !semesterFilter || enrollment.semester === semesterFilter
    
    return matchesSearch && matchesStatus && matchesSemester
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Check if student is already enrolled in the course
      const existingEnrollment = enrollments.find(e => 
        e.studentId === formData.studentId && 
        e.courseId === formData.courseId &&
        e.status === "enrolled"
      )
      
      if (existingEnrollment) {
        toast.error("Student is already enrolled in this course")
        return
      }

      const newEnrollment = await enrollmentService.create(formData)
      setEnrollments(prev => [...prev, newEnrollment])
      toast.success("Student enrolled successfully!")
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      const updatedEnrollment = await enrollmentService.update(enrollmentId, { status: newStatus })
      setEnrollments(prev => prev.map(e => e.Id === enrollmentId ? updatedEnrollment : e))
      toast.success(`Enrollment status updated to ${newStatus}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      studentId: "",
      courseId: "",
      semester: "",
      status: "enrolled"
    })
  }

  const columns = [
    {
      key: "studentId",
      label: "Student",
      sortable: true,
      render: (studentId, enrollment) => {
        const student = students.find(s => s.Id === parseInt(studentId))
        return student ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-900">{student.firstName} {student.lastName}</p>
              <p className="text-sm text-slate-500">{student.email}</p>
            </div>
          </div>
        ) : "Unknown Student"
      }
    },
    {
      key: "courseId",
      label: "Course",
      sortable: true,
      render: (courseId) => {
        const course = courses.find(c => c.Id === parseInt(courseId))
        return course ? (
          <div>
            <p className="font-medium text-slate-900">{course.code}</p>
            <p className="text-sm text-slate-600">{course.name}</p>
          </div>
        ) : "Unknown Course"
      }
    },
    {
      key: "semester",
      label: "Semester",
      sortable: true
    },
    {
      key: "enrollmentDate",
      label: "Enrollment Date",
      sortable: true,
      render: (date) => format(new Date(date), "MMM d, yyyy")
    },
    {
      key: "grade",
      label: "Grade",
      sortable: true,
      render: (grade) => (
        <span className="font-medium text-slate-900">
          {grade || "N/A"}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (status, enrollment) => (
        <div className="flex items-center space-x-2">
          {getStatusBadge(status)}
          {status === "enrolled" && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleStatusChange(enrollment.Id, "completed")}
                className="text-xs text-green-600 hover:text-green-800 font-medium"
                title="Mark as completed"
              >
                Complete
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleStatusChange(enrollment.Id, "dropped")}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
                title="Mark as dropped"
              >
                Drop
              </button>
            </div>
          )}
        </div>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadEnrollments} />

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
                Enrollment Management
              </h1>
              <p className="text-slate-600 mt-1">Manage student course enrollments</p>
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
              Enroll Student
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
                    placeholder="Search enrollments..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="sm:w-48"
                >
                  <option value="">All Status</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </Select>
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

        {/* Enrollments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredEnrollments.length === 0 ? (
            <Empty
              title="No enrollments found"
              description="Start by enrolling students in courses."
              action={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              actionLabel="Enroll First Student"
              icon="UserPlus"
            />
          ) : (
            <DataTable
              data={filteredEnrollments}
              columns={columns}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Enroll Student Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title="Enroll Student in Course"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Student" required>
              <Select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              >
                <option value="">Select Student</option>
                {students
                  .filter(s => s.status === "active")
                  .map((student) => (
                    <option key={student.Id} value={student.Id}>
                      {student.firstName} {student.lastName} ({student.email})
                    </option>
                  ))}
              </Select>
            </FormField>

            <FormField label="Course" required>
              <Select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.code} - {course.name} ({course.semester})
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
                Enroll Student
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Enrollment