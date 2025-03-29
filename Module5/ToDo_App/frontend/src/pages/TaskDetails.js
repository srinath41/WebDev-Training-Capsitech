import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchTasks, updateTask, deleteTask, fetchProjectUsers } from "../services/api";

const TaskDetails = ({ projectId }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [editData, setEditData] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      if (!token || !projectId) {
        console.error("Token or Project ID missing!");
        return;
      }
      try {
        const response = await fetchTasks(projectId, token);
        console.log("Fetched Tasks:", response);
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
  }, [token, projectId]);


  const toggleTaskDetails = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleEdit = (task) => {
    setEditData(task);
    setShowEditForm(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!token) return;
    try {
      const updatedTask = await updateTask(editData._id, editData, token);
      setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!token) return;
    try {
      await deleteTask(taskId, token);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="mb-4 bg-white shadow-md rounded-lg">
            {/* Task Header */}
            <button
              onClick={() => toggleTaskDetails(task._id)}
              className="w-full text-left p-4 font-semibold text-lg bg-gray-200 rounded-t-lg flex justify-between"
            >
              {task.taskTitle}
              <span>{expandedTask === task._id ? "▲" : "▼"}</span>
            </button>

            {/* Task Details (Collapsible) */}
            {expandedTask === task._id && (
              <div className="p-4 border-t">
                <p><strong>Description:</strong> {task.taskDescription}</p>
                <p><strong>Status:</strong> {task.taskStatus}</p>
                <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(task.endDate).toLocaleDateString()}</p>
                <p><strong>Assigned Users:</strong> 
                  {task.assignedUsers.length > 0 ? (
                    <ul className="ml-4 list-disc">
                      {task.assignedUsers.map((user) => (
                        <li key={user._id}>{user.name}</li>
                      ))}
                    </ul>
                  ) : (
                    " No users assigned"
                  )}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No tasks available.</p>
      )}

      {/* Edit Task Modal */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit Task</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  name="taskTitle"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={editData.taskTitle}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <textarea
                  type="text"
                  name="taskDescription"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={editData.taskDescription}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="taskStatus"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={editData.taskStatus}
                  onChange={handleEditChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editData.endDate}
                    onChange={handleEditChange}
                  />
                </div>
              
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;