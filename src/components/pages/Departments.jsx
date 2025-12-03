import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import useDepartments from "@/hooks/useDepartments"
import useCourses from "@/hooks/useCourses"
import useFaculty from "@/hooks/useFaculty"
import DataTable from "@/components/organisms/DataTable"
import SearchBar from "@/components/molecules/SearchBar"
import Modal from "@/components/molecules/Modal"
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"

const Departments = () => {
  const { departments, loading, error, loadDepartments, createDepartment, updateDepartment, deleteDepartment } = useDepartments()
  const { courses } = useCourses()
  const { faculty } = useFaculty()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headOfDepartment: "",
    description: ""
  })

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCourseCount = (departmentId) => {
    return courses.filter(c => c.departmentId === departmentId).length
  }

  const getFacultyCount = (departmentId) => {
    return faculty.filter(f => f.departmentId === departmentId).length
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      headOfDepartment: department.headOfDepartment,
      description: department.description
    })
    setIsModalOpen(true)
  }

  const handleDelete = (department) => {
    setDeleteConfirmation(department)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.Id, formData)
        toast.success("Department updated successfully!")
      } else {
        await createDepartment(formData)
        toast.success("Department created successfully!")
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
      await deleteDepartment(deleteConfirmation.Id)
      toast.success("Department deleted successfully!")
      setDeleteConfirmation(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setEditingDepartment(null)
    setFormData({
      name: "",
      code: "",
      headOfDepartment: "",
      description: ""
    })
  }

  const columns = [
    {
      key: "name",
      label: "Department",
      sortable: true,
      render: (_, dept) => (
        <div>
          <p className="font-medium text-slate-900">{dept.name}</p>
          <p className="text-sm text-slate-600">Code: {dept.code}</p>
        </div>
      )
    },
    {
      key: "headOfDepartment",
      label: "Department Head",
      sortable: true,
      render: (head) => (
        <span className="font-medium text-slate-900">{head}</span>
      )
    },
    {
      key: "facultyCount",
      label: "Faculty",
      sortable: false,
      render: (_, dept) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getFacultyCount(dept.Id)} members
          </span>
        </div>
      )
    },
    {
      key: "courseCount",
      label: "Courses",
      sortable: false,
      render: (_, dept) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {getCourseCount(dept.Id)} courses
          </span>
        </div>
      )
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (description) => (
        <span className="text-sm text-slate-600 truncate max-w-xs block">
          {description}
        </span>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadDepartments} />

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
                Departments Management
              </h1>
              <p className="text-slate-600 mt-1">Manage academic departments and their structure</p>
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
              Add Department
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <Card.Content className="py-4">
              <SearchBar
                placeholder="Search departments..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Card.Content>
          </Card>
        </motion.div>

        {/* Departments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredDepartments.length === 0 ? (
            <Empty
              title="No departments found"
              description="Start by adding your first academic department."
              action={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              actionLabel="Add First Department"
              icon="Building"
            />
          ) : (
            <DataTable
              data={filteredDepartments}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Add/Edit Department Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title={editingDepartment ? "Edit Department" : "Add New Department"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Department Name" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Computer Science"
                  required
                />
              </FormField>

              <FormField label="Department Code" required>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CS"
                  required
                />
              </FormField>

              <FormField label="Head of Department" className="md:col-span-2" required>
                <Input
                  value={formData.headOfDepartment}
                  onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                  placeholder="e.g., Dr. John Smith"
                  required
                />
              </FormField>

              <FormField label="Description" className="md:col-span-2">
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the department"
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
                {editingDepartment ? "Update Department" : "Add Department"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title="Delete Department"
          message={`Are you sure you want to delete the ${deleteConfirmation?.name} department? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      </div>
    </div>
  )
}

export default Departments