import { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        alert("Access denied or error fetching users");
      }
    };
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}`, { role });
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  if (!user || user.role !== "admin") {
    return <h2 className="p-6">Access Denied</h2>;
  }

  return (
    <div className="p-6">
      <h2>Admin Panel</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => changeRole(u._id, "admin")}>Make Admin</button>
                <button onClick={() => changeRole(u._id, "user")}>Make User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
