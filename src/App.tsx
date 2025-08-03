import { useEffect, useState } from 'react'
import axios from 'axios'
import CreateTask from './components/CreateTask'
import TaskList from './components/TaskList'
import { Task } from './types'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleTaskUpdated = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task)
  }

  const fetchTasks = async () => {
    const res = await axios.get<Task[]>(`${API_URL}/tasks`)
    // Sort descending by id (newest first)
    const sorted = res.data.sort((a, b) => b.id! - a.id!)
    console.log(import.meta.env, 'mode')
    setTasks(sorted)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
          <CreateTask
            onTaskCreated={handleTaskCreated}
            onTaskUpdated={handleTaskUpdated}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <TaskList tasks={tasks} onEdit={handleTaskEdit} />
        </div>
      </div>
    </div>
  )
}
