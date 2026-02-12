import { useEffect, useState } from "react";
import api from "../api/api";
import TaskForm from "../components/TaskForm";
import { getUser } from "../utils/auth";

export default function Dashboard() {
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (data) => {
    setMessage("");
    setError("");

    try {
      const res = await api.post("/tasks", data);
      setMessage(res.data.message);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task creation failed");
    }
  };

  const handleUpdate = async (data) => {
    setMessage("");
    setError("");

    try {
      const res = await api.put(`/tasks/${editTask._id}`, data);
      setMessage(res.data.message);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task update failed");
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const res = await api.delete(`/tasks/${id}`);
      setMessage(res.data.message);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Welcome {user?.name} 👋
      </h1>

      <p className="text-center text-gray-600 mb-6">
        Role: <span className="font-bold">{user?.role}</span>
      </p>

      {message && (
        <p className="text-green-700 bg-green-100 p-2 rounded text-center mb-3">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-700 bg-red-100 p-2 rounded text-center mb-3">
          {error}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <TaskForm
          onSubmit={editTask ? handleUpdate : handleCreate}
          initialData={editTask}
          buttonText={editTask ? "Update Task" : "Create Task"}
        />

        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Task List</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="border p-3 rounded flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: <span className="font-bold">{task.status}</span>
                    </p>

                    {user?.role === "admin" && task.user && (
                      <p className="text-xs text-blue-600 mt-1">
                        Owner: {task.user.name} ({task.user.email})
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setEditTask(task)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
