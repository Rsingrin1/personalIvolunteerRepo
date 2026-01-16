import React, { useEffect, useState } from "react";
import "../assets/editUser.css";
import axios from "axios";
import { Link } from "react-router-dom";
//import toast from "react-hot-toast";

const User = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user", err);
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };


  return (
    <div className="userTable">

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">userID</th>
            <th scope="col">User Type</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email} </td>
                <td>{user._id}</td>
                <td>{user.userType || "N/A"}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default User;
