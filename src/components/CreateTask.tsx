import { useEffect, useState } from 'react'
import axios from 'axios'
import { Task } from '../types'

export default function CreateTask({
  onTaskCreated,
  onTaskUpdated,
  editingTask,
  setEditingTask
}: {
  onTaskCreated: (task: Task) => void
  onTaskUpdated: (task: Task) => void
  editingTask: Task | null
  setEditingTask: (task: Task | null) => void
}) {
  const [task, setTask] = useState<Task>({
    title: '',
    description: '',
    status: 'pending'
  })
  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status
      })
    }
  }, [editingTask])

  const [message, setMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const { title, description, status } = task

      if (editingTask) {
        // Update existing task
        const res = await axios.put<Task>(
          `${API_URL}/tasks/${editingTask.id}`,
          {
            title,
            description,
            status
          }
        )
        setMessage(`Task updated: ${res.data.title}`)
        onTaskUpdated(res.data)
        setEditingTask(null) // Exit edit mode
      } else {
        // Create a new task
        const res = await axios.post<Task>(`${API_URL}/tasks`, {
          title,
          description,
          status
        })
        setMessage(`Task created: ${res.data.title}`)
        onTaskCreated(res.data)
      }

      // Reset the form
      setTask({ title: '', description: '', status: 'pending' })
    } catch {
      setMessage(editingTask ? 'Error updating task' : 'Error creating task')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create Task</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </form>
      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
    </div>
  )
}
