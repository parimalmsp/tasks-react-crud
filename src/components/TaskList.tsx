import { Task } from '../types'

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
}

export default function TaskList({ tasks, onEdit }: Props) {
  if (tasks.length === 0)
    return <div className="text-gray-600">No tasks available.</div>

  return (
    <div className="space-y-2 w-full">
      <h2 className="text-xl font-semibold mb-4">List Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center p-2 border rounded"
        >
          <div>
            <p className="font-bold">{task.title}</p>
            <p className="text-sm text-gray-500">{task.status}</p>
          </div>
          <button
            onClick={() => onEdit(task)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  )
}
