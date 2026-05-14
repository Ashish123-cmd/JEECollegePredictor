import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!fullName || !email || !password) {
      setErr("Please fill in all fields");
      return;
    }

    try {
      await register(email, password, fullName);
      navigate("/");
    } catch (e) {
      setErr(e.message || "Registration failed");
    }
  };

  const containerStyle = {
    maxWidth: 500,
    margin: "40px auto",
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  };

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#111"
  };

  const subheadingStyle = {
    fontSize: "14px",
    color: "#888",
    marginBottom: "24px"
  };

  const inputStyle = {
    display: "block",
    marginBottom: "16px",
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit"
  };

  const inputContainerStyle = {
    position: "relative",
    marginBottom: "16px"
  };

  const eyeIconStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
    color: "#666"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#0090a8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "16px"
  };

  const errorStyle = {
    background: "#fff3cd",
    border: "1px solid #ffc107",
    color: "#856404",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px"
  };

  const loginLinkStyle = {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "16px",
    borderTop: "1px solid #eee",
    paddingTop: "16px"
  };

  const loginButtonStyle = {
    background: "#fff",
    color: "#0090a8",
    border: "1px solid rgba(0,0,0,0.08)",
    padding: "10px 16px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "4px",
    fontSize: "14px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Account</h2>
      <p style={subheadingStyle}>Sign up to get started.</p>

      {err && (
        <div style={errorStyle}>
          {err}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <input
          style={inputStyle}
          placeholder="Full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          type="text"
        />

        <input
          style={inputStyle}
          placeholder="Mobile or email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
        />

        <div style={inputContainerStyle}>
          <input
            style={inputStyle}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <span
            style={eyeIconStyle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        <button type="submit" style={buttonStyle}>
          Create account
        </button>
      </form>

      <div style={loginLinkStyle}>
        Already have an account?
        <button
          type="button"
          style={loginButtonStyle}
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
