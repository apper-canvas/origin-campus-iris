import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { toast } from "react-toastify"
import useAttendance from "@/hooks/useAttendance"
import useStudents from "@/hooks/useStudents"
import useCourses from "@/hooks/useCourses"
import DataTable from "@/components/organisms/DataTable"
import SearchBar from "@/components/molecules/SearchBar"
import Modal from "@/components/molecules/Modal"
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

const Attendance = () => {
  const { 
    attendance, 
    loading, 
    error, 
    loadAttendance, 
    recordBulkAttendance,
    updateAttendance,
    getAttendancePercentage,
    getLowAttendanceStudents
  } = useAttendance()
  const { students } = useStudents()
  const { courses } = useCourses()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [courseFilter, setCourseFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [studentAttendance, setStudentAttendance] = useState({})
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({})

  useEffect(() => {
    loadLowAttendanceStudents()
    calculateAttendanceStats()
  }, [attendance, students])

  const loadLowAttendanceStudents = async () => {
    try {
      const lowStudents = await getLowAttendanceStudents(75)
      setLowAttendanceStudents(lowStudents)
    } catch (err) {
      console.error("Failed to load low attendance students:", err)
    }
  }

  const calculateAttendanceStats = async () => {
    try {
      const stats = {}
      for (const student of students) {
        const percentage = await getAttendancePercentage(student.Id)
        stats[student.Id] = percentage
      }
      setAttendanceStats(stats)
    } catch (err) {
      console.error("Failed to calculate attendance stats:", err)
    }
  }

  const filteredAttendance = attendance.filter(record => {
    const student = students.find(s => s.Id === record.studentId)
    const course = courses.find(c => c.Id === record.courseId)
    
    const matchesSearch = 
      (student && (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.email.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (course && (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.code.toLowerCase().includes(searchTerm.toLowerCase())))
    
    const matchesStatus = !statusFilter || record.status === statusFilter
    const matchesCourse = !courseFilter || record.courseId === parseInt(courseFilter)
    const matchesDate = !dateFilter || record.date === dateFilter
    
    return matchesSearch && matchesStatus && matchesCourse && matchesDate
  })

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
      present: "success",
      absent: "danger"
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const getAttendanceBadge = (percentage) => {
    if (percentage >= 90) return <Badge variant="success">{percentage}%</Badge>
    if (percentage >= 75) return <Badge variant="warning">{percentage}%</Badge>
    return <Badge variant="danger">{percentage}%</Badge>
  }

  const handleTakeAttendance = (course) => {
    setSelectedCourse(course)
    
    // Get enrolled students for this course
    const enrolledStudents = students.filter(student => 
      student.status === "active"
    )
    
    // Initialize attendance state
    const initialAttendance = {}
    enrolledStudents.forEach(student => {
      initialAttendance[student.Id] = "present"
    })
    
    setStudentAttendance(initialAttendance)
    setIsAttendanceModalOpen(true)
  }

  const handleSubmitAttendance = async (e) => {
    e.preventDefault()
    if (!selectedCourse) return
    
    try {
      const attendanceRecords = Object.entries(studentAttendance).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        courseId: selectedCourse.Id,
        date: attendanceDate,
        status,
        semester: selectedCourse.semester
      }))
      
      await recordBulkAttendance(attendanceRecords)
      toast.success(`Attendance recorded for ${attendanceRecords.length} students`)
      setIsAttendanceModalOpen(false)
      setSelectedCourse(null)
      setStudentAttendance({})
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleStatusToggle = (recordId, currentStatus) => {
    const newStatus = currentStatus === "present" ? "absent" : "present"
    updateAttendance(recordId, { status: newStatus })
      .then(() => {
        toast.success(`Attendance updated to ${newStatus}`)
      })
      .catch(err => {
        toast.error(err.message)
      })
  }

  const columns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (date) => format(new Date(date), "MMM d, yyyy")
    },
    {
      key: "studentId",
      label: "Student",
      sortable: true,
      render: (studentId, record) => {
        const student = students.find(s => s.Id === parseInt(studentId))
        const percentage = attendanceStats[studentId] || 0
        
        return student ? (
          <div className="flex items-center justify-between">
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
            <div className="flex items-center space-x-2">
              {getAttendanceBadge(percentage)}
              {percentage < 75 && (
                <ApperIcon name="AlertTriangle" className="w-4 h-4 text-red-500" title="Low Attendance Alert" />
              )}
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
      key: "status",
      label: "Status",
      sortable: true,
      render: (status, record) => (
        <div className="flex items-center space-x-2">
          {getStatusBadge(status)}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusToggle(record.Id, status)}
            className={`text-xs ${status === "present" ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}`}
          >
            Mark {status === "present" ? "Absent" : "Present"}
          </Button>
        </div>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadAttendance} />

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
                Attendance Management
              </h1>
              <p className="text-slate-600 mt-1">Track student attendance and identify at-risk students</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button
                variant="secondary"
                icon="Eye"
                onClick={() => setIsModalOpen(true)}
              >
                View Alerts
              </Button>
              <Button
                variant="primary"
                icon="Plus"
                onClick={() => {
                  // Show course selection for taking attendance
                  if (courses.length === 0) {
                    toast.error("No courses available. Please add courses first.")
                    return
                  }
                  
                  // For demo, take attendance for first course
                  if (courses.length > 0) {
                    handleTakeAttendance(courses[0])
                  }
                }}
              >
                Take Attendance
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Alert Cards */}
        {lowAttendanceStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="border-red-200 bg-red-50">
              <Card.Content className="py-4">
                <div className="flex items-center space-x-2 mb-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-red-900">Low Attendance Alert</h3>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  {lowAttendanceStudents.length} student(s) have attendance below 75%
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowAttendanceStudents.slice(0, 5).map(({ studentId, percentage }) => {
                    const student = students.find(s => s.Id === studentId)
                    return student ? (
                      <Badge key={studentId} variant="danger" className="text-xs">
                        {student.firstName} {student.lastName} ({percentage}%)
                      </Badge>
                    ) : null
                  })}
                  {lowAttendanceStudents.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lowAttendanceStudents.length - 5} more
                    </Badge>
                  )}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <Card.Content className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SearchBar
                  placeholder="Search students or courses..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </Select>
                <Select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.Id} value={course.Id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </Select>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="Filter by date"
                />
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Attendance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredAttendance.length === 0 ? (
            <Empty
              title="No attendance records found"
              description="Start by taking attendance for your courses."
              action={() => {
                if (courses.length > 0) {
                  handleTakeAttendance(courses[0])
                } else {
                  toast.error("No courses available. Please add courses first.")
                }
              }}
              actionLabel="Take First Attendance"
              icon="UserCheck"
            />
          ) : (
            <DataTable
              data={filteredAttendance}
              columns={columns}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Low Attendance Alerts Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Low Attendance Alerts"
          size="lg"
        >
          <div className="space-y-4">
            {lowAttendanceStudents.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">All Good!</h3>
                <p className="text-slate-600">No students have attendance below 75%</p>
              </div>
            ) : (
              lowAttendanceStudents.map(({ studentId, totalClasses, presentCount, absentCount, percentage }) => {
                const student = students.find(s => s.Id === studentId)
                return student ? (
                  <Card key={studentId} className="border-red-200">
                    <Card.Content className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-red-700">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-slate-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="danger" className="mb-2">{percentage}%</Badge>
                          <p className="text-xs text-slate-500">
                            {presentCount}/{totalClasses} classes attended
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </Card.Content>
                  </Card>
                ) : null
              })
            )}
          </div>
        </Modal>

        {/* Take Attendance Modal */}
        <Modal
          isOpen={isAttendanceModalOpen}
          onClose={() => {
            setIsAttendanceModalOpen(false)
            setSelectedCourse(null)
            setStudentAttendance({})
          }}
          title={`Take Attendance - ${selectedCourse?.code} ${selectedCourse?.name}`}
          size="lg"
        >
          <form onSubmit={handleSubmitAttendance} className="space-y-6">
            <FormField label="Date" required>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                required
              />
            </FormField>

            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Mark Attendance</h4>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {students
                  .filter(student => student.status === "active")
                  .map((student) => (
                    <div key={student.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={studentAttendance[student.Id] === "present" ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setStudentAttendance(prev => ({ ...prev, [student.Id]: "present" }))}
                        >
                          Present
                        </Button>
                        <Button
                          type="button"
                          variant={studentAttendance[student.Id] === "absent" ? "danger" : "secondary"}
                          size="sm"
                          onClick={() => setStudentAttendance(prev => ({ ...prev, [student.Id]: "absent" }))}
                        >
                          Absent
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAttendanceModalOpen(false)
                  setSelectedCourse(null)
                  setStudentAttendance({})
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Attendance
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Attendance