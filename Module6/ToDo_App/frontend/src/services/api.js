import axios from "axios"; 

const API = axios.create({
  baseURL: "http://localhost:5220/api",
});

// =======================
// User Authentication
// =======================

export const loginUser = async (credentials) => {
    try {
      const response = await API.post("users/login", credentials);
      return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  

export const registerUser = async (userData) => {
  const response = await API.post("users/register", userData);
  return response.data;
};

// =======================
// User Management (Admin Only)
// =======================

export const fetchUsers = async (token, params = {}) => {
  try {
    const response = await API.get("users", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: params.search,
        role: params.role,
        isActive: params.isActive,
        sortBy: params.sortBy,
        sortDescending: params.sortDescending,
        page: params.page || 1,          // Default to page 1
        perPage: params.perPage || 10    // Default to 10 items per page
      }
    });
    
    // Return both the data and pagination info
    return {
      users: response.data.data || [],         // Actual user data
      pagination: response.data.pagination || { // Pagination metadata
        currentPage: 1,
        perPage: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error);
    return {
      users: [],
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
};

export const updateUser = async (userId, updatedData, token) => {
  try {
    
    const response = await API.put(`users/${userId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error);
    throw error;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    await API.delete(`users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("User deleted successfully:", userId);
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error);
    throw error;
  }
};

// =======================
// Project CRUD Operations
// =======================

export const fetchProjects = async (token, params = {}) => {
  try {
    const response = await API.get("/projects", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: params.search,
        status: params.status,
        category: params.category,       // Added category filter
        isDeleted: params.isDeleted,
        sortBy: params.sortBy,
        sortDescending: params.sortDescending,
        page: params.page || 1,         // Default to page 1
        perPage: params.perPage || 6    // Default to 6 items per page as per requirements
      }
    });
    
    // Return both the data and pagination info in consistent structure
    return {
      projects: response.data.data || [],         // Actual project data
      pagination: response.data.pagination || {   // Pagination metadata
        currentPage: 1,
        perPage: 6,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error);
    return {
      projects: [],
      pagination: {
        currentPage: 1,
        perPage: 6,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
};

export const fetchProjectDetails = async (id, token) => {
    try {
      const response = await API.get(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching project details:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const fetchProjectUsers = async (projectId, token) => {
    try {
      const response = await API.get(`/projects/${projectId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Expected to return an array of assigned users
    } catch (error) {
      console.error("Error fetching project users:", error.response?.data || error);
      throw error;
    }
  };

export const createProject = async (projectData, token) => {
  try {
    const response = await API.post("/projects", projectData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error.response?.data || error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData, token) => {
  const response = await API.put(`/projects/${projectId}`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProject = async (projectId, token) => {
  try {
    await API.delete(`/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Project deleted successfully:", projectId);
  } catch (error) {
    console.error("Delete project error:", error.response?.data || error);
    throw error;
  }
};

// =======================
// Task Management
// =======================

// Fetch tasks for a specific project
export const fetchTasks = async (projectId, token) => {
    try {
      const response = await API.get(`/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error);
      throw error;
    }
  };
  
  // Create a new task for a project (Admin Only)
  export const createTask = async (projectId, taskData, token) => {
    try {
      const response = await API.post(`/tasks/${projectId}`, taskData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error);
      throw error;
    }
  };

  // Update a task (Assigned users can update status. and admin can do update anything)
  export const updateTask = async (taskId, updatedData, token) => {
    try {
      const response = await API.put(`/tasks/${taskId}`, updatedData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error);
      throw error;
    }
  };
  
  // Delete a task (Admin Only)
  export const deleteTask = async (taskId, token) => {
    try {
      await API.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Task deleted successfully:", taskId);
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
      throw error;
    }
  };
  