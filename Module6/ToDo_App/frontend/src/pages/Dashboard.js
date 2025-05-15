import { useEffect, useState, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";

import {
  fetchProjects,
  fetchUsers,
  updateUser,
  deleteUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import CreateProjectForm from "../components/createproject";
import CreateUser from "../components/createuser";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    isActive: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: true,
    sortBy: 'name',
    sortDescending: false
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  

  // Project management filters and pagination
  const [projectFilters, setProjectFilters] = useState({
    search: '',
    status: '',
    category: '',
    isDeleted: undefined,
    sortBy: 'title',
    sortDescending: false
  });

  const [projectPagination, setProjectPagination] = useState({
    currentPage: 1,
    perPage: 6,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  }); 

  
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const navigate = useNavigate();
  
  // Load projects with filters and pagination
  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const data = await fetchProjects(user.token, {
        ...projectFilters,
        page: projectPagination.currentPage,
        perPage: projectPagination.perPage
      });
      setProjects(data.projects);
      setProjectPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  }, [user.token, projectFilters, projectPagination.currentPage]);

  // Load users with filters and pagination
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsers(user.token, {
        ...filters,
        page: pagination.currentPage,
        perPage: pagination.perPage
      });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [user.token, filters, pagination.currentPage]);

  // Load data when tab changes or filters update
  useEffect(() => {
    if (user?.token) {
      if (activeTab === "projects") {
        loadProjects();
      } else if (activeTab === "users" && user?.role === "admin") {
        loadUsers();
      }
    }
  }, [activeTab, user, loadProjects, loadUsers, pagination.currentPage]);

  const handleUpdateClick = (userItem) => {
    setEditUser(userItem.id);
    setFormData({
      name: userItem.name,
      email: userItem.email,
      role: userItem.role,
      isActive: userItem.isActive,
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      await updateUser(editUser, formData, user.token);
      
      // Properly update the users state
      const usersData = await fetchUsers(user.token);
    setUsers(usersData);
      
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId, user.token);
      setUsers(users.filter((u) => u.id !== userId));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectFilterChange = (name, value) => {
    setProjectFilters(prev => ({
      ...prev,
      [name]: value,
      // When changing status to anything except "isDeleted", ensure isDeleted is not set
      isDeleted: value === "isDeleted" ? true : value === "active" ? false : undefined,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };
  
  const handleProjectPageChange = (newPage) => {
    setProjectPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // New handler for sorting
  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDescending: prev.sortBy === field ? !prev.sortDescending : false
    }));
  };

  const handleProjectSort = (field) => {
    setProjectFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDescending: prev.sortBy === field ? !prev.sortDescending : false
    }));
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 border-r border-gray-100">
        <div className="flex items-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>

        <nav className="space-y-2">
          {user?.role === "admin" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Members
            </button>
          )}

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === "projects"
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Projects
          </button>
        </nav>

        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full mt-8 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, <span className="text-blue-600 uppercase">{user?.name}</span>
            </h2>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {user?.name.charAt(0)}
          </div>
        </header>

        {user?.role === "admin" && activeTab === "projects" && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Admin Panel
              </h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Project
                </button>
              )}
            </div>

            {showForm && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <CreateProjectForm onCancel={() => setShowForm(false)} />
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && user?.role === "admin" ? (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
              <p className="text-gray-500 text-sm mt-1">
                Manage all system users and their permissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Role Filter */}
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              
              
              {/* Active Status Filter */}
              <label className="inline-flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  checked={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active Only</span>
              </label>
              
              <button
                onClick={() => handleSort('name')}
                className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {filters.sortBy === 'name' && (
                  filters.sortDescending ? (
                    // Down arrow SVG
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ) : (
                    // Up arrow SVG
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )
                )}
              </button>

              
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New User
              </button>
            </div>
          </div>
        
          {showCreateUserModal && (
            <CreateUser 
              onClose={() => setShowCreateUserModal(false)} 
              onUserCreated={loadUsers}
            />
          )}
        
          {loadingUsers ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h4 className="mt-4 text-lg font-medium text-gray-600">No users found</h4>
              <p className="text-gray-400 mt-2">
                Try adjusting your filters or creating a new user
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
      <tr>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
        >
          <div className="flex items-center space-x-1">
            <span>User</span>
          </div>
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
        >
          <div className="flex items-center space-x-1">
            <span>Email</span>
          </div>
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
          Role
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {Array.isArray(users) && users.map((userItem) => (
        <tr key={userItem.id} className="hover:bg-gray-50 transition-colors duration-150">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-medium mr-3 shadow-sm border border-blue-50">
                {userItem.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {userItem.name}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-gray-600">{userItem.email}</div>
            {userItem.emailVerified && (
              <div className="text-xs text-green-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                userItem.role === "admin"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                userItem.isActive
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {userItem.isActive ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleUpdateClick(userItem)}
                className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(userItem.id)}
                className="text-red-600 hover:text-red-900 flex items-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  
  {/* User Management Pagination */}
  {pagination.totalPages > 1 && (
    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
          className={`px-4 py-2 rounded-lg border flex items-center ${
            pagination.hasPreviousPage 
              ? 'border-gray-300 hover:bg-white text-gray-700 shadow-xs' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } 
            else if (pagination.currentPage <= 3) {
              pageNum = i + 1;
            } 
            else if (pagination.currentPage >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i;
            } 
            else {
              pageNum = pagination.currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 rounded-md flex items-center justify-center text-sm ${
                  pagination.currentPage === pageNum 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'border border-gray-300 hover:bg-white text-gray-700 shadow-xs'
                } transition-colors duration-200`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
            <span className="mx-1 text-gray-500">...</span>
          )}
          
          {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className={`w-9 h-9 rounded-md flex items-center justify-center text-sm ${
                pagination.currentPage === pagination.totalPages 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'border border-gray-300 hover:bg-white text-gray-700 shadow-xs'
              } transition-colors duration-200`}
            >
              {pagination.totalPages}
            </button>
          )}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-4 py-2 rounded-lg border flex items-center ${
            pagination.hasNextPage 
              ? 'border-gray-300 hover:bg-white text-gray-700 shadow-xs' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          Next
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )}
</div>
              
            )}
          </section>
        ) : (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <h3 className="text-2xl font-bold text-gray-900">Projects Overview</h3>
      <p className="text-gray-500 text-sm mt-1">
        {projectPagination.totalCount} projects found
        {projectFilters.search && ` matching "${projectFilters.search}"`}
        {projectFilters.status && ` with status "${projectFilters.status}"`}
      </p>
    </div>
    
    {/* Filter and Sort Controls */}
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search projects..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={projectFilters.search}
          onChange={(e) => handleProjectFilterChange('search', e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={projectFilters.status}
        onChange={(e) => handleProjectFilterChange('status', e.target.value)}
      >
        <option value="">All Projects</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        {user?.role === "admin" && <option value="active">Active Projects</option>}
        {user?.role === "admin" && <option value="isDeleted">Deleted</option>}
      </select>
      
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={projectFilters.sortBy}
        onChange={(e) => handleProjectFilterChange('sortBy', e.target.value)}
      >
        <option value="title">Sort by</option>
        <option value="title">Name</option>
        <option value="startDate">Start Date</option>
        <option value="endDate">End Date</option>
      </select>

      {/* Sort Toggle Button */}
      <button
        onClick={() => handleProjectFilterChange('sortDescending', !projectFilters.sortDescending)}
        className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
      >
        {projectFilters.sortDescending ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        )}
      </button>
    </div>
  </div>

  {loadingProjects ? (
  <div className="flex justify-center items-center py-20">
    <div className="relative">
      <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
        </svg>
      </div>
    </div>
  </div>
) : projects.length === 0 ? (
  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
    <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <h4 className="mt-2 text-lg font-medium text-gray-700">No projects found</h4>
    <p className="text-gray-500 mt-1 max-w-md mx-auto">
      {projectFilters.search || projectFilters.status
        ? "Try adjusting your search or filter criteria"
        : "Get started by creating your first project"}
    </p>
    {!projectFilters.search && !projectFilters.status && (
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
        Create New Project
      </button>
    )}
  </div>
) : (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => {
        let statusColor = "bg-gray-100 text-gray-800 border-gray-200";
        if (project.projectStatus === "Completed")
          statusColor = "bg-green-50 text-green-700 border-green-100";
        else if (project.projectStatus === "Pending")
          statusColor = "bg-red-50 text-red-700 border-red-100";
        else if (project.projectStatus === "In Progress")
          statusColor = "bg-yellow-50 text-yellow-700 border-yellow-100";
        else if (project.isDelete)
          statusColor = "bg-gray-200 text-gray-600 border-gray-300";

        return (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className={`group border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all duration-200 cursor-pointer ${
              project.isDelete ? "opacity-40" : "hover:border-blue-100 hover:shadow-blue-50/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3 gap-2">
              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base">
                {project.title}
              </h4>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusColor} whitespace-nowrap flex-shrink-0`}
              >
                {project.isDelete ? "Deleted" : project.projectStatus}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {project.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
              <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium text-gray-600">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">
                  {new Date(project.endDate).toLocaleDateString('en-GB', {
                    timeZone: 'UTC',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Pagination Controls */}
    {projectPagination.totalPages > 1 && (
      <div className="flex items-center justify-between mt-10 px-1">
        <button
          onClick={() => handleProjectPageChange(projectPagination.currentPage - 1)}
          disabled={!projectPagination.hasPreviousPage}
          className={`px-4 py-2 rounded-lg border flex items-center gap-1 text-sm ${
            projectPagination.hasPreviousPage 
              ? 'border-gray-300 hover:bg-white text-gray-700 shadow-xs' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(5, projectPagination.totalPages) }, (_, i) => {
            let pageNum;
            if (projectPagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (projectPagination.currentPage <= 3) {
              pageNum = i + 1;
            } else if (projectPagination.currentPage >= projectPagination.totalPages - 2) {
              pageNum = projectPagination.totalPages - 4 + i;
            } else {
              pageNum = projectPagination.currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handleProjectPageChange(pageNum)}
                className={`w-9 h-9 rounded-md flex items-center justify-center text-sm ${
                  projectPagination.currentPage === pageNum 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'border border-gray-300 hover:bg-white text-gray-700 shadow-xs'
                } transition-colors duration-200`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {projectPagination.totalPages > 5 && projectPagination.currentPage < projectPagination.totalPages - 2 && (
            <span className="mx-1 text-gray-500">...</span>
          )}
          
          {projectPagination.totalPages > 5 && projectPagination.currentPage < projectPagination.totalPages - 2 && (
            <button
              onClick={() => handleProjectPageChange(projectPagination.totalPages)}
              className={`w-9 h-9 rounded-md flex items-center justify-center text-sm ${
                projectPagination.currentPage === projectPagination.totalPages 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'border border-gray-300 hover:bg-white text-gray-700 shadow-xs'
              } transition-colors duration-200`}
            >
              {projectPagination.totalPages}
            </button>
          )}
        </div>
        
        <button
          onClick={() => handleProjectPageChange(projectPagination.currentPage + 1)}
          disabled={!projectPagination.hasNextPage}
          className={`px-4 py-2 rounded-lg border flex items-center gap-1 text-sm ${
            projectPagination.hasNextPage 
              ? 'border-gray-300 hover:bg-white text-gray-700 shadow-xs' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )}
  </>
)}
</section>
        )}
      </main>

      {/* Update User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Update User
              </h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="active-checkbox"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="active-checkbox"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active account
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-3">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
            </div>

            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-3">
                Confirm Logout
              </h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to log out?
              </p>
            </div>

            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setConfirmLogout(false);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;