import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change according to backend
});

export const loginUser = async (credentials) => {
  const response = await API.post("/users/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/users/register", userData);
  return response.data;
};

export const fetchProjects = async (token) => {
  const response = await API.get("/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchProjectDetails = async (id) => await API.get(`/projects/${id}`);
export const fetchTaskDetails = async (id) => await API.get(`/tasks/${id}`);