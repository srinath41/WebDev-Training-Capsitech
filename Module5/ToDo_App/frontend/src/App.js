import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import ProtectedRoute from "./components/ProtectedRoute"; // Ensures authentication

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
      <Route path="/projects/:projectId" element={<ProtectedRoute component={ProjectDetails} />} />
      <Route path="/tasks/:taskId" element={<ProtectedRoute component={TaskDetails} />} />
    </Routes>
  );
}

export default App;
