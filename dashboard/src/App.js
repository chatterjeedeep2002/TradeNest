import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminPanel from "./components/AdminPanel";
import PrivateRoute from "./PrivateRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import ExportButtons from './components/ExportButtons';
import Notifications from './components/Notifications';
import AddFunds from './components/AddFunds';

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const { dark, setDark } = useContext(ThemeContext);
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
      <Link to="/dashboard">Dashboard</Link>
      {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
      <Link to="/notifications">Notifications</Link>
      <Link to="/exports">Exports</Link>
      <Link to="/addfunds">Add Funds</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/signup">Signup</Link>}
      {user && <button onClick={logout}>Logout</button>}
      <button onClick={() => setDark(!dark)}>{dark ? 'Light' : 'Dark'}</button>
    </nav>
  );
}

function DashboardPage() {
  return <div className="p-6">Welcome to Dashboard (protected)</div>;
}

export default function App() {
  return (
    <ThemeProvider>
    <Router>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/exports" element={<PrivateRoute><ExportButtons /></PrivateRoute>} />
        <Route path="/addfunds" element={<PrivateRoute><AddFunds /></PrivateRoute>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}
