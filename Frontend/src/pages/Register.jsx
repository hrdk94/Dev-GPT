import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">
          ✦
        </div>

        <h1>Create account</h1>

        <p className="auth-subtitle">
          Start chatting with your AI assistant
        </p>

        <form onSubmit={handleRegister}>
          <label>Name</label>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;