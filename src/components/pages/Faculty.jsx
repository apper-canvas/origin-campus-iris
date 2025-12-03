import React, { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { toast } from "react-toastify"
import useFaculty from "@/hooks/useFaculty"
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

const Faculty = () => {
  const { faculty, loading, error, loadFaculty, createFaculty, updateFaculty, deleteFaculty } = useFaculty()
  const { departments } = useDepartments()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    designation: "",
    specialization: "",
    joiningDate: ""
  })

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !departmentFilter || member.departmentId === departmentFilter
    
    return matchesSearch && matchesDepartment
  })

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.Id === departmentId)
    return department ? department.name : "Unknown"
  }

  const getDesignationColor = (designation) => {
    const colors = {
      "Professor": "primary",
      "Associate Professor": "success",
      "Assistant Professor": "warning",
      "Lecturer": "default"
    }
    return colors[designation] || "default"
  }

  const handleEdit = (member) => {
    setEditingFaculty(member)
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      departmentId: member.departmentId,
      designation: member.designation,
      specialization: member.specialization,
      joiningDate: member.joiningDate
    })
    setIsModalOpen(true)
  }

  const handleDelete = (member) => {
    setDeleteConfirmation(member)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.Id, formData)
        toast.success("Faculty member updated successfully!")
      } else {
        await createFaculty(formData)
        toast.success("Faculty member created successfully!")
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
      await deleteFaculty(deleteConfirmation.Id)
      toast.success("Faculty member deleted successfully!")
      setDeleteConfirmation(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setEditingFaculty(null)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      designation: "",
      specialization: "",
      joiningDate: ""
    })
  }

  const columns = [
    {
      key: "firstName",
      label: "Faculty Member",
      sortable: true,
      render: (_, member) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-purple-700">
              {member.firstName[0]}{member.lastName[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">{member.firstName} {member.lastName}</p>
            <p className="text-sm text-slate-500">{member.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "designation",
      label: "Designation",
      sortable: true,
      render: (designation) => (
        <Badge variant={getDesignationColor(designation)}>
          {designation}
        </Badge>
      )
    },
    {
      key: "departmentId",
      label: "Department",
      sortable: true,
      render: (departmentId) => getDepartmentName(departmentId)
    },
    {
      key: "specialization",
      label: "Specialization",
      sortable: true,
      render: (specialization) => (
        <span className="text-sm text-slate-600">{specialization}</span>
      )
    },
    {
      key: "joiningDate",
      label: "Joining Date",
      sortable: true,
      render: (date) => format(new Date(date), "MMM d, yyyy")
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadFaculty} />

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
                Faculty Management
              </h1>
              <p className="text-slate-600 mt-1">Manage faculty members and their profiles</p>
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
              Add Faculty
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
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="sm:w-48"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.Id} value={dept.Id}>{dept.name}</option>
                  ))}
                </Select>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Faculty Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredFaculty.length === 0 ? (
            <Empty
              title="No faculty found"
              description="Start by adding your first faculty member to the system."
              action={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              actionLabel="Add First Faculty"
              icon="Users"
            />
          ) : (
            <DataTable
              data={filteredFaculty}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Add/Edit Faculty Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title={editingFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}
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

              <FormField label="Designation" required>
                <Select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </Select>
              </FormField>

              <FormField label="Joining Date" required>
                <Input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Specialization" className="md:col-span-2" required>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Computer Science, Software Engineering"
                  required
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
                {editingFaculty ? "Update Faculty" : "Add Faculty"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title="Delete Faculty Member"
          message={`Are you sure you want to delete ${deleteConfirmation?.firstName} ${deleteConfirmation?.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      </div>
    </div>
  )
}

export default Faculty