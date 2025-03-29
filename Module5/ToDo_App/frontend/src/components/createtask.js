import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchProjectUsers, createTask } from "../services/api";

const CreateTaskForm = ({ onCancel, projectId }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [formData, setFormData] = useState({
    taskTitle: "",
    taskDescription: "",
    startDate: "",
    endDate: "",
    assignedUsers: [],
  });

  const [users, setUsers] = useState([]);

  // Fetch users from API
  useEffect(() => {
    const getUsers = async () => {
        if (!token || !projectId) {
            console.error("Token or Project ID missing!");
            return;
        }
        try {
            const response = await fetchProjectUsers(projectId, token);
            console.log("Fetched users:", response); // ✅ Debugging
            setUsers(response); // ✅ Directly setting users
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    getUsers();
}, [token, projectId]); // Ensure dependencies update correctly

  

  // Handle text and category input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox selection for users
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      assignedUsers: checked
        ? [...prev.assignedUsers, value] // Add user if checked
        : prev.assignedUsers.filter((id) => id !== value), // Remove if unchecked
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const newProject = await createTask(projectId, formData, token);
      console.log("Project Created Successfully:", newProject);
      onCancel(); // Close form after successful creation
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Title */}
        <input
          type="text"
          name="taskTitle"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        {/* Project Description */}
        <textarea
          name="taskDescription"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        {/* Assigned Users (Checkbox List) */}
        <div className="w-full p-2 border rounded-md">
          <h3 className="text-sm font-medium mb-2">Assign Users:</h3>
          {users.length > 0 ? (
            users.map((user) => (
              <label key={user._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={user._id}
                  checked={formData.assignedUsers.includes(user._id)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {user.name}
              </label>
            ))
          ) : (
            <p className="text-gray-500">No users available</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;
