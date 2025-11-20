import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all users
  const fetchAll = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/view");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    }
  };

  // Search by name
  const searchUser = async () => {
    try {
      if (!search) {
        fetchAll();
        return;
      }
      const res = await axios.get(
        `http://localhost:5000/user/search?name=${search}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error searching users:", err);
      alert("Failed to search users");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      alert("User deleted successfully!");
      fetchAll(); // refresh list
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registered Users</h2>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px", borderRadius: "5px" }}
        />
        <button onClick={searchUser} style={{ padding: "8px 15px", borderRadius: "5px" }}>
          Search
        </button>
        <button
          onClick={fetchAll}
          style={{
            padding: "8px 15px",
            marginLeft: "10px",
            borderRadius: "5px",
            backgroundColor: "#ccc",
          }}
        >
          Reset
        </button>
      </div>

      {/* Users Table */}
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Place</th>
            <th>Username</th>
            <th>Action</th> {/* New column for delete */}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender || "-"}</td>
                <td>{user.place}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => deleteUser(user._id)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "red",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
