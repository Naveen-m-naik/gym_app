import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);

  /* ================= FETCH ALL USERS ================= */
  const fetchAll = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/view");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users");
    }
  };

  /* ================= SEARCH USER ================= */
  const searchUser = async () => {
    try {
      if (!search) return fetchAll();

      const res = await axios.get(
        `http://localhost:5000/user/search?name=${search}`
      );

      setUsers(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      fetchAll();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= UPDATE USER ================= */
  const updateUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/user/update/${editUser._id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("User updated successfully!");
      setEditUser(null);
      fetchAll();
    } catch (err) {
      alert("Update failed");
    }
  };

  /* ================= HANDLE INPUT CHANGE ================= */
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

      {/* ================= SEARCH BOX ================= */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button onClick={searchUser} style={{ marginLeft: "10px" }}>
          Search
        </button>

        <button onClick={fetchAll} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      {/* ================= TABLE ================= */}
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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.gender || "-"}</td>
              <td>{user.place}</td>
              <td>{user.username}</td>

              <td>
                <button
                  onClick={() => setEditUser(user)}
                  style={{
                    background: "green",
                    color: "white",
                    marginRight: "8px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  Update
                </button>

                <button
                  onClick={() => deleteUser(user._id)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= UPDATE POPUP ================= */}
      {editUser && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#111827",
            padding: "25px",
            borderRadius: "12px",
            width: "380px",
            color: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Update User
          </h3>

          {/* NAME */}
          <label>Name:</label>
          <input
            name="name"
            value={editUser.name}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* EMAIL */}
          <label>Email:</label>
          <input
            name="email"
            value={editUser.email}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* PHONE */}
          <label>Phone:</label>
          <input
            name="phone"
            value={editUser.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* PLACE */}
          <label>Place:</label>
          <input
            name="place"
            value={editUser.place}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* WEIGHT */}
          <label>Weight:</label>
          <input
            name="weight"
            value={editUser.weight || ""}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* HEIGHT */}
          <label>Height:</label>
          <input
            name="height"
            value={editUser.height || ""}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* BUTTONS */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
            <button
              onClick={updateUser}
              style={{
                background: "#22c55e",
                color: "white",
                padding: "8px 15px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setEditUser(null)}
              style={{
                background: "#ef4444",
                color: "white",
                padding: "8px 15px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= INPUT STYLE ================= */
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "none",
};

export default UserList;