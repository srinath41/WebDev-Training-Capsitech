import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { fetchProjectDetails, updateProject, deleteProject, fetchUsers } from "../services/api";
import CreateTaskForm from "../components/createtask";
import TaskDetails from "./TaskDetails";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({
    assignedUsers: [],
  });
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getProjectDetails = async () => {
      if (!token) return;
      try {
        const data = await fetchProjectDetails(projectId, token);
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load project details.");
        setLoading(false);
      }
    };

    const getUsers = async () => {
      if (!token) return;
      try {
        const users = await fetchUsers(token);
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users.");
      }
    };

    getProjectDetails();
    getUsers();
  }, [projectId, token]);

  const handleDelete = async () => {
    try {
      await deleteProject(projectId, token);
      navigate("/projects"); // Redirect after deletion
    } catch (err) {
      console.error("Failed to delete project.");
    }
  };

  const handleEditClick = () => {
    if (!project || !project.assignedUsers) return; // Avoid errors
    setEditData({
      ...project,
      endDate: project.endDate ? project.endDate.split("T")[0] : "", 
      assignedUsers: project.assignedUsers.map((u) => u._id) || [],
    });
    setShowEditForm(true);
  };
  

  const handleSaveEdit = async () => {
    try {
      await updateProject(projectId, editData, token);
      setProject((prev) => ({
        ...prev,
        assignedUsers: allUsers.filter(user => editData.assignedUsers.includes(user._id))
      }));
      setShowEditForm(false);
    } catch (err) {
      console.error("Failed to update project.");
    }
  };
  
  

  if (loading) return <p className="text-center text-gray-600">Loading project details...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!project) return <p className="text-center text-gray-600">No project found.</p>;

  const statusColors = {
    "Completed": "bg-green-500",
    "Pending": "bg-red-500",
    "In Progress": "bg-yellow-500"
  };
  const statusColor = statusColors[project.projectStatus] || "bg-gray-500";

  return (
    <div className="relative min-h-screen bg-gray-50 py-8">
      {/* Dim Background when popups are open */}
      {(showEditForm || showDeleteConfirm) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"></div>
      )}
  
      {/* Project Details Card */}
      <div className={`max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-all ${
        (showEditForm || showDeleteConfirm) ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
      }`}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor} shadow-sm`}>
                  {project.projectStatus}
                </span>
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {project.category}
                </span>
              </div>
            </div>
  
            {/* Admin Controls */}
            {user?.role === "admin" && (
              <div className="flex space-x-2">
                <button 
                  onClick={handleEditClick}
                  className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-200"
                  title="Edit Project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-all duration-200"
                  title="Delete Project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Project Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
  
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">End Date:</span>
                    <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  
                </div>
              </div>
  
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Team Members</h3>
                {project.assignedUsers.length > 0 ? (
                  <div className="space-y-3">
                    {project.assignedUsers.map((u) => (
                      <div key={u._id} className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {u.name.charAt(0)}
                        </div>
                        <span className="text-gray-700">{u.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No team members assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {user?.role === "admin" && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="p-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                Create Task
              </button>

              {showForm && (
                <div className="mt-4">
                  <CreateTaskForm projectId={projectId} onCancel={() => setShowForm(false)} />
                </div>
              )}
            </div>
          </div>
        )}
        <TaskDetails projectId={projectId}/>

      {/* Edit Project Modal */}
      {showEditForm && (
  <div className="fixed inset-0 flex items-center justify-center z-30 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Edit Project</h2>
        <button
          className={`px-4 py-2 flex items-center space-x-2 rounded text-white ${
            editData.isDelete ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={() => setEditData({ ...editData, isDelete: !editData.isDelete })}
        >
          {editData.isDelete ? (
            <>
              {/* Curved Restore Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.6 7.4A9 9 0 1 0 21 12h-2a7 7 0 1 1-2.1-4.9l-2.3 2.3H21V3l-2.4 2.4z"/>
              </svg>
              <span>Restore</span>
            </>
          ) : (
            <>
              {/* Trash Bin Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Move to Bin</span>
            </>
          )}
        </button>
      </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {allUsers?.length > 0 ? (
                    allUsers.map((u) => (
                      <label key={u._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          className="rounded text-blue-500 focus:ring-blue-500"
                          checked={editData?.assignedUsers?.includes(u._id) || false}
                          onChange={(e) => {
                            const updatedUsers = e.target.checked
                              ? [...editData.assignedUsers, u._id]
                              : editData.assignedUsers.filter(id => id !== u._id);
                            setEditData({ ...editData, assignedUsers: updatedUsers });
                          }}
                        />
                        <span>{u?.name || "Unknown User"}</span>
                      </label>
                    ))
                  ) : (
                    <p>Loading users...</p>
                  )}
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editData.endDate}
                    onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editData.projectStatus}
                    onChange={(e) => setEditData({ ...editData, projectStatus: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
  
              

            </div>
  
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
