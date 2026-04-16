import React, { useEffect, useState } from "react";
import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);

  /* ================= FETCH ALL USERS ================= */
  const fetchAll = async () => {
    try {
      const res = await API.get("/user/view");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  /* ================= SEARCH USER ================= */
  const searchUser = async () => {
    try {
      if (!search) return fetchAll();

      const res = await API.get(`/user/search?name=${search}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/user/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= UPDATE USER ================= */
  const updateUser = async () => {
    try {
      await API.put(`/user/update/${editUser._id}`, editUser);

      alert("User updated successfully!");
      setEditUser(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Registered Users</h2>

      {/* SEARCH */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <button onClick={searchUser}>Search</button>
        <button onClick={fetchAll} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      {/* TABLE */}
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Place</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender || "-"}</td>
                <td>{user.place}</td>
                <td>{user.username}</td>

                <td>
                  <button onClick={() => setEditUser(user)}>Update</button>
                  <button onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* UPDATE POPUP */}
      {editUser && (
        <div style={popupStyle}>
          <h3>Update User</h3>

          <input name="name" value={editUser.name} onChange={handleChange} style={inputStyle} />
          <input name="email" value={editUser.email} onChange={handleChange} style={inputStyle} />
          <input name="phone" value={editUser.phone} onChange={handleChange} style={inputStyle} />
          <input name="place" value={editUser.place} onChange={handleChange} style={inputStyle} />
          <input name="weight" value={editUser.weight || ""} onChange={handleChange} style={inputStyle} />
          <input name="height" value={editUser.height || ""} onChange={handleChange} style={inputStyle} />

          <button onClick={updateUser}>Save</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

/* STYLES */
const inputStyle = {
  padding: "8px",
  margin: "5px",
};

const popupStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#111",
  padding: "20px",
  color: "white",
};

export default UserList;