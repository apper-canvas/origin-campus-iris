import React, { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { toast } from "react-toastify"
import useStudents from "@/hooks/useStudents"
import useDepartments from "@/hooks/useDepartments"
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

const Students = () => {
  const { students, loading, error, loadStudents, createStudent, updateStudent, deleteStudent } = useStudents()
  const { departments } = useDepartments()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    departmentId: "",
    address: "",
    status: "active"
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || student.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      departmentId: student.departmentId,
      address: student.address,
      status: student.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = (student) => {
    setDeleteConfirmation(student)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.Id, formData)
        toast.success("Student updated successfully!")
      } else {
        await createStudent(formData)
        toast.success("Student created successfully!")
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
      await deleteStudent(deleteConfirmation.Id)
      toast.success("Student deleted successfully!")
      setDeleteConfirmation(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setEditingStudent(null)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      departmentId: "",
      address: "",
      status: "active"
    })
  }

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.Id === departmentId)
    return department ? department.name : "Unknown"
  }

  const renderStatusBadge = (status) => {
    const variants = {
      active: "success",
      inactive: "default",
      graduated: "info"
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const columns = [
    {
      key: "firstName",
      label: "Name",
      sortable: true,
      render: (_, student) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {student.firstName[0]}{student.lastName[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">{student.firstName} {student.lastName}</p>
            <p className="text-sm text-slate-500">{student.email}</p>
          </div>
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
      key: "enrollmentDate",
      label: "Enrollment Date",
      sortable: true,
      render: (date) => format(new Date(date), "MMM d, yyyy")
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (status) => renderStatusBadge(status)
    },
    {
      key: "gpa",
      label: "GPA",
      sortable: true,
      render: (gpa) => (
        <span className="font-medium text-slate-900">
          {gpa ? gpa.toFixed(2) : "N/A"}
        </span>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadStudents} />

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
                Students Management
              </h1>
              <p className="text-slate-600 mt-1">Manage student records and information</p>
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
              Add Student
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
                    placeholder="Search students..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </Select>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredStudents.length === 0 ? (
            <Empty
              title="No students found"
              description="Start by adding your first student to the system."
              action={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              actionLabel="Add First Student"
              icon="GraduationCap"
            />
          ) : (
            <DataTable
              data={filteredStudents}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Add/Edit Student Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title={editingStudent ? "Edit Student" : "Add New Student"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="First Name" required>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Last Name" required>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Email" required>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Phone">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </FormField>

              <FormField label="Date of Birth" required>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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

              <FormField label="Status" className="md:col-span-2">
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </Select>
              </FormField>

              <FormField label="Address" className="md:col-span-2">
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                {editingStudent ? "Update Student" : "Add Student"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title="Delete Student"
          message={`Are you sure you want to delete ${deleteConfirmation?.firstName} ${deleteConfirmation?.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      </div>
    </div>
  )
}

export default Students