import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setUserNotFound(false);

    if (!email || !password) {
      setErr("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      if (e.message && e.message.includes("not found")) {
        setUserNotFound(true);
      } else {
        setErr("Invalid email or password");
      }
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

  const forgotStyle = {
    fontSize: "12px",
    color: "#0090a8",
    textDecoration: "none",
    float: "right",
    marginBottom: "16px"
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

  const signupLinkStyle = {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "16px",
    borderTop: "1px solid #eee",
    paddingTop: "16px"
  };

  const signupButtonStyle = {
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
      <h2 style={headingStyle}>Log in</h2>
      <p style={subheadingStyle}>Please login to your account.</p>

      {userNotFound && (
        <div style={errorStyle}>
          Your EmailId/Mobile number is not registered with us. Please Sign up first
        </div>
      )}

      {err && (
        <div style={errorStyle}>
          {err}
        </div>
      )}

      <form onSubmit={onSubmit}>
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

        <a style={forgotStyle} href="#forgot">Forgot Password ?</a>
        <div style={{ clear: "both" }}></div>

        <button type="submit" style={buttonStyle}>
          Log in
        </button>
      </form>

      <div style={signupLinkStyle}>
        Don't have an account Yet?
        <button
          type="button"
          style={signupButtonStyle}
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
