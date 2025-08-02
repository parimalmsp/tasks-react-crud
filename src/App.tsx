import { useEffect, useState } from 'react'
import axios from 'axios'
import CreateTask from './components/CreateTask'
import TaskList from './components/TaskList'
import { Task } from './types'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    const res = await axios.get<Task[]>('http://127.0.0.1:8000/tasks')
    // Sort descending by id (newest first)
    const sorted = res.data.sort((a, b) => b.id! - a.id!)

    setTasks(sorted)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = (task: Task) => {
    // Newest task at the beginning
    setTasks((prev) => [task, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
          <CreateTask onTaskCreated={addTask} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
