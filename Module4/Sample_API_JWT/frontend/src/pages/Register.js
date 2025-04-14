import { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", { username, password });
  
      // ✅ Check if response and response.data exist
      if (response && response.data) {
        alert("User registered successfully!");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Registration error:", error);  // Debugging
      alert("Error: " + (error.response?.data?.error || "Something went wrong"));
    }
  };
  

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
