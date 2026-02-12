import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import { getUser } from "../utils/auth";

export default function Dashboard() {
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const payload = { title, description, status };
      await api.post("/tasks", payload);

      toast.success("Task created successfully");
      setTitle("");
      setDescription("");
      setStatus("pending");

      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Task creation failed");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
  };

  const closeEditModal = () => {
    setEditTask(null);
    setEditTitle("");
    setEditDescription("");
    setEditStatus("pending");
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      await api.put(`/tasks/${editTask._id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });

      toast.success("Task updated successfully");
      closeEditModal();
      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (!search.trim()) return true;
        return (
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
        );
      })
      .filter((t) => {
        if (filterStatus === "all") return true;
        return t.status === filterStatus;
      });
  }, [tasks, search, filterStatus]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const progressCount = tasks.filter((t) => t.status === "in-progress").length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;

    return { total, pendingCount, progressCount, completedCount };
  }, [tasks]);

  const statusBadge = (taskStatus) => {
    if (taskStatus === "pending") {
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
    if (taskStatus === "in-progress") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    }
    if (taskStatus === "completed") {
      return "bg-green-100 text-green-700 border border-green-200";
    }
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-slate-600 mt-1">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 border">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <h2 className="text-2xl font-bold text-slate-800">{stats.total}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border">
          <p className="text-sm text-slate-500">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">
            {stats.pendingCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border">
          <p className="text-sm text-slate-500">In Progress</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {stats.progressCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.completedCount}
          </h2>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Task */}
        <div className="bg-white rounded-xl shadow border p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Create New Task
          </h2>

          <form onSubmit={createTask} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Create Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow border p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-slate-800">Task List</h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-slate-500">No tasks found.</p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="border rounded-xl p-4 flex justify-between items-start hover:shadow-md transition bg-slate-50"
                >
                  <div className="w-[75%]">
                    <h3 className="font-bold text-slate-800">{task.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {task.description}
                    </p>

                    <span
                      className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold ${statusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
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

      {/* Edit Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Edit Task
            </h2>

            <form onSubmit={updateTask} className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-200 text-slate-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
