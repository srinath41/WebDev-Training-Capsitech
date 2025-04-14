import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authorized. Please log in.");
      return;
    }

    axios
      .get("http://localhost:5000/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => alert("Failed to fetch profile"));
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? <p>Username: {user.username}</p> : <p>Loading...</p>}
    </div>
  );
}

export default Profile;
