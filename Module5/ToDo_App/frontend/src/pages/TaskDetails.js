import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
      setNewStatus(res.data.status);
    };
    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Task Updated!");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Task Deleted!");
    navigate(-1);
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2>{task.name}</h2>
      <p>{task.description}</p>
      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button onClick={handleUpdate}>Update Status</button>
      <button onClick={handleDelete} style={{ color: "red" }}>Delete Task</button>
    </div>
  );
};

export default TaskDetails;
