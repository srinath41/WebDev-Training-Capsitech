import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchProjects, fetchUsers, updateUser, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import CreateProjectForm from "../components/createproject";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", isActive: true });
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const projectData = await fetchProjects(user.token);
        setProjects(projectData);
        if (user?.role === "admin") {
          const usersData = await fetchUsers(user.token);
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?.token) {
      loadDashboardData();
    }
  }, [user]);

  const handleUpdateClick = (userItem) => {
    setEditUser(userItem._id);
    setFormData({ name: userItem.name, email: userItem.email, role: userItem.role, isActive: userItem.isActive });
  };

  const handleUpdateSubmit = async () => {
    try {
      const updatedUser = await updateUser(editUser, formData, user.token);
      setUsers(users.map((u) => (u._id === editUser ? { ...u, ...updatedUser } : u)));
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId, user.token);
      setUsers(users.filter((u) => u._id !== userId));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
        {user?.role === "admin" && (
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-2 mb-2 rounded-md ${
              activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Members
          </button>
        )}
        <button
          onClick={() => setActiveTab("projects")}
          className={`w-full text-left px-4 py-2 rounded-md ${
            activeTab === "projects" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Projects
        </button>
        <button
          onClick={logout}
          className="w-full mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        </header>
        {user?.role === "admin" && activeTab === "projects" && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Admin Panel</h3>
            <div className="p-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                Create New Project
              </button>

              {showForm && (
                <div className="mt-4">
                  <CreateProjectForm onCancel={() => setShowForm(false)} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && user?.role === "admin" ? (
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Registered Users</h3>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((userItem) => (
                  <div key={userItem._id} className="p-4 bg-white rounded-lg shadow-sm border">
                    <h4 className="font-medium text-lg text-gray-800">{userItem.name}</h4>
                    <p className="text-gray-600">{userItem.email}</p>
                    <p className="text-sm text-gray-500">Role: {userItem.role}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className={userItem.isActive ? "text-green-500" : "text-red-500"}>
                        {userItem.isActive ? "Enabled" : "Disabled"}
                      </span>
                    </p>

                    <button
                      onClick={() => handleUpdateClick(userItem)}
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setConfirmDelete(userItem._id)}
                      className="ml-2 mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Projects</h3>
            {projects.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No projects found.</p>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => {
                    // Determine the status color
                    let statusColor = "bg-gray-500"; // Default color
                    if (project.projectStatus === "Completed") statusColor = "bg-green-500";
                    else if (project.projectStatus === "Pending") statusColor = "bg-red-500";
                    else if (project.projectStatus === "In Progress") statusColor = "bg-yellow-500";
                
                    return (
                      <div
                        key={project._id}
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className={`relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition border cursor-pointer ${
                          project.isDelete ? "opacity-50" : ""
                        }`}
                      >
                        {/* Project Status at Top Right */}
                        <span
                          className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded-full ${statusColor}`}
                        >
                          {project.projectStatus}
                        </span>
                        
                        {/* Project Title */}
                        <h4 className="font-medium text-lg text-gray-800 mb-2">
                          {project.title}
                        </h4>
                        
                        {/* Project Category */}
                        <p className="text-gray-600 mb-3 font-semibold">
                          Category: {project.category}
                        </p>
                      </div>
                    );
                  })}
                </div>
            )}
          </section>
        )}
      </main>

      {/* Update User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Update User</h3>
            <input
              type="text"
              className="w-full mb-3 px-3 py-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              className="w-full mb-3 px-3 py-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
            />
            <select
              className="w-full mb-3 px-3 py-2 border rounded"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span>{formData.isActive ? "Enabled" : "Disabled"}</span>
            </label>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={handleUpdateSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <p className="text-gray-700 font-medium">Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4 space-x-3">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

