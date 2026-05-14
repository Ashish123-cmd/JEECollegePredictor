import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navStyle = { display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee", alignItems: "center" };
  return (
    <nav style={navStyle}>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {!user ? (
          <>
            <Link to="/login">Login/Register</Link>
          </>
        ) : (
          <>
            <span>Hi, {user.fullName}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
