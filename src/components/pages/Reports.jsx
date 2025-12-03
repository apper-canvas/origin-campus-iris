import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import Chart from "react-apexcharts"
import useStudents from "@/hooks/useStudents"
import useCourses from "@/hooks/useCourses"
import useDepartments from "@/hooks/useDepartments"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import enrollmentService from "@/services/api/enrollmentService"

const Reports = () => {
  const { students, loading: studentsLoading, error: studentsError } = useStudents()
  const { courses, loading: coursesLoading, error: coursesError } = useCourses()
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments()
  const [enrollments, setEnrollments] = useState([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)
  const [enrollmentsError, setEnrollmentsError] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")

  const loadEnrollments = async () => {
    try {
      setEnrollmentsLoading(true)
      setEnrollmentsError("")
      const data = await enrollmentService.getAll()
      setEnrollments(data)
    } catch (err) {
      setEnrollmentsError(err.message || "Failed to load enrollments")
    } finally {
      setEnrollmentsLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  const isLoading = studentsLoading || coursesLoading || departmentsLoading || enrollmentsLoading
  const error = studentsError || coursesError || departmentsError || enrollmentsError

  if (isLoading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={() => window.location.reload()} />

  // Calculate statistics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === "active").length
  const totalCourses = courses.length
  const activeCourses = courses.filter(c => c.semester === "Fall 2024").length
  const totalEnrollments = enrollments.filter(e => e.status === "enrolled").length

  // Department enrollment data
  const departmentData = departments.map(dept => {
    const deptStudents = students.filter(s => s.departmentId === dept.Id)
    const deptCourses = courses.filter(c => c.departmentId === dept.Id)
    return {
      name: dept.name,
      students: deptStudents.length,
      courses: deptCourses.length,
      activeStudents: deptStudents.filter(s => s.status === "active").length
    }
  })

  // Student status distribution
  const statusData = [
    { status: "Active", count: students.filter(s => s.status === "active").length, color: "#10b981" },
    { status: "Inactive", count: students.filter(s => s.status === "inactive").length, color: "#64748b" },
    { status: "Graduated", count: students.filter(s => s.status === "graduated").length, color: "#3b82f6" }
  ]

  // Course enrollment data
  const courseEnrollmentData = courses.map(course => ({
    name: course.code,
    enrolled: course.enrolled,
    capacity: course.capacity,
    percentage: Math.round((course.enrolled / course.capacity) * 100)
  })).sort((a, b) => b.enrolled - a.enrolled).slice(0, 10)

  // Charts configuration
  const pieChartOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false }
    },
    labels: statusData.map(item => item.status),
    colors: statusData.map(item => item.color),
    legend: {
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "30%"
        }
      }
    }
  }

  const pieChartSeries = statusData.map(item => item.count)

  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: departmentData.map(dept => dept.name)
    },
    colors: ["#3b82f6", "#10b981"],
    legend: {
      position: "top"
    }
  }

  const barChartSeries = [
    {
      name: "Students",
      data: departmentData.map(dept => dept.students)
    },
    {
      name: "Courses",
      data: departmentData.map(dept => dept.courses)
    }
  ]

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
                Reports & Analytics
              </h1>
              <p className="text-slate-600 mt-1">Comprehensive insights into your academic data</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-48"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.Id} value={dept.Id}>{dept.name}</option>
                ))}
              </Select>
              <Button variant="secondary" icon="Download">
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <Card.Content className="py-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="GraduationCap" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
              <p className="text-slate-600">Total Students</p>
              <p className="text-sm text-green-600 mt-1">{activeStudents} active</p>
            </Card.Content>
          </Card>

          <Card className="text-center">
            <Card.Content className="py-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{totalCourses}</h3>
              <p className="text-slate-600">Total Courses</p>
              <p className="text-sm text-green-600 mt-1">{activeCourses} this semester</p>
            </Card.Content>
          </Card>

          <Card className="text-center">
            <Card.Content className="py-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Building" className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{departments.length}</h3>
              <p className="text-slate-600">Departments</p>
            </Card.Content>
          </Card>

          <Card className="text-center">
            <Card.Content className="py-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="UserPlus" className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{totalEnrollments}</h3>
              <p className="text-slate-600">Active Enrollments</p>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <ApperIcon name="PieChart" className="w-5 h-5 mr-2 text-primary-600" />
                  Student Status Distribution
                </h2>
              </Card.Header>
              <Card.Content>
                <Chart
                  options={pieChartOptions}
                  series={pieChartSeries}
                  type="donut"
                  height={300}
                />
              </Card.Content>
            </Card>
          </motion.div>

          {/* Department Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <ApperIcon name="BarChart" className="w-5 h-5 mr-2 text-primary-600" />
                  Department Overview
                </h2>
              </Card.Header>
              <Card.Content>
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={300}
                />
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* Top Courses by Enrollment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary-600" />
                Top Courses by Enrollment
              </h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {courseEnrollmentData.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-900">{course.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {course.enrolled}/{course.capacity}
                        </p>
                        <p className="text-xs text-slate-500">enrolled</p>
                      </div>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>
                      <Badge
                        variant={course.percentage >= 90 ? "danger" : course.percentage >= 70 ? "warning" : "success"}
                      >
                        {course.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Department Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <ApperIcon name="Building" className="w-5 h-5 mr-2 text-primary-600" />
                Department Statistics
              </h2>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Department</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-900">Total Students</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-900">Active Students</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-900">Courses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{dept.name}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{dept.students}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{dept.activeStudents}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{dept.courses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Reports