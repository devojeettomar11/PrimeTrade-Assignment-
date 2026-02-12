import { useState } from "react";

export default function TaskForm({ onSubmit, initialData, buttonText }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "pending");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-3">
      <h2 className="text-lg font-bold text-gray-800">{buttonText}</h2>

      <input
        type="text"
        placeholder="Task Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Task Description"
        className="w-full border p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <select
        className="w-full border p-2 rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        {buttonText}
      </button>
    </form>
  );
}
