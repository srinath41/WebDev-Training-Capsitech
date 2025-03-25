import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchProjects } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log("Fetching projects for user:", user);
        const data = await fetchProjects(user.token);
        console.log("Projects fetched:", data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    if (user?.token) {
      loadProjects();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200"
        >
          Logout
        </button>
      </header>
  
      {/* Admin Section */}
      {user?.role === "admin" && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Admin Panel</h3>
          <button
            onClick={() => navigate("/create-project")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
          >
            Create New Project
          </button>
        </div>
      )}
  
      {/* Projects Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Projects</h3>
        
        {projects.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No projects found. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-100 hover:border-blue-200"
              >
                <h4 className="font-medium text-lg text-gray-800 mb-2">{project.title}</h4>
                <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {project.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    Created by: {project.createdBy?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
