import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://coffee-shop-backend-8pcw.onrender.com/api/admin/login";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.message ||
          "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login-section">
      <div className="admin-login-box">
        <div className="admin-login-icon">
          🔐
        </div>

        <p className="small-title">
          OWNER ACCESS
        </p>

        <h2>Admin Login</h2>

        <p className="admin-login-description">
          Sign in to manage Wedajo Coffee customer
          orders.
        </p>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-username">
            Username
          </label>

          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Enter admin username"
            autoComplete="username"
          />

          <label htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter admin password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="primary-btn admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "🔑 Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
