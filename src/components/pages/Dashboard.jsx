import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import StatCard from "@/components/organisms/StatCard"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import studentsService from "@/services/api/studentsService"
import coursesService from "@/services/api/coursesService"
import facultyService from "@/services/api/facultyService"
import enrollmentService from "@/services/api/enrollmentService"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeCourses: 0,
    facultyMembers: 0,
    currentEnrollments: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      const [students, courses, faculty, enrollments] = await Promise.all([
        studentsService.getAll(),
        coursesService.getAll(),
        facultyService.getAll(),
        enrollmentService.getAll()
      ])

      setDashboardData({
        totalStudents: students.length,
        activeCourses: courses.filter(c => c.semester === "Fall 2024").length,
        facultyMembers: faculty.length,
        currentEnrollments: enrollments.filter(e => e.status === "enrolled").length
      })

      // Generate recent activity
      const recentEnrollments = enrollments
        .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
        .slice(0, 8)
        .map(enrollment => {
          const student = students.find(s => s.Id === parseInt(enrollment.studentId))
          const course = courses.find(c => c.Id === parseInt(enrollment.courseId))
          return {
            id: enrollment.Id,
            type: "enrollment",
            message: `${student?.firstName} ${student?.lastName} enrolled in ${course?.name}`,
            time: enrollment.enrollmentDate,
            icon: "UserPlus"
          }
        })

      setRecentActivity(recentEnrollments)

    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadDashboardData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Campus Hub Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Comprehensive overview of your college management system
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={dashboardData.totalStudents}
            icon="GraduationCap"
            color="blue"
            index={0}
          />
          <StatCard
            title="Active Courses"
            value={dashboardData.activeCourses}
            icon="BookOpen"
            color="green"
            index={1}
          />
          <StatCard
            title="Faculty Members"
            value={dashboardData.facultyMembers}
            icon="Users"
            color="purple"
            index={2}
          />
          <StatCard
            title="Current Enrollments"
            value={dashboardData.currentEnrollments}
            icon="UserPlus"
            color="yellow"
            index={3}
          />
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <Card.Header>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-primary-600" />
                  Quick Actions
                </h2>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  icon="UserPlus"
                  onClick={() => window.location.href = "/students"}
                >
                  Add New Student
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon="BookOpen"
                  onClick={() => window.location.href = "/courses"}
                >
                  Create Course
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon="Users"
                  onClick={() => window.location.href = "/faculty"}
                >
                  Add Faculty Member
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon="ClipboardList"
                  onClick={() => window.location.href = "/enrollment"}
                >
                  Manage Enrollment
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon="BarChart3"
                  onClick={() => window.location.href = "/reports"}
                >
                  View Reports
                </Button>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <Card.Header>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary-600" />
                  Recent Activity
                </h2>
              </Card.Header>
              <Card.Content>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                          <ApperIcon name={activity.icon} className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900">{activity.message}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(activity.time), "MMM d, yyyy")}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Activity" className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500">No recent activity</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <ApperIcon name="Settings" className="w-5 h-5 mr-2 text-primary-600" />
                System Status
              </h2>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Database</h3>
                  <p className="text-sm text-green-600">All systems operational</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Shield" className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Security</h3>
                  <p className="text-sm text-blue-600">Secure and protected</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ApperIcon name="Zap" className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Performance</h3>
                  <p className="text-sm text-yellow-600">Optimal speed</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard