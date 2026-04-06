import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Lock, User } from "lucide-react";

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkedAuth, setCheckedAuth] = useState(false); // ✅ added

  // ✅ Redirect if already logged in (fixed)
  useEffect(() => {
    const isAuth = localStorage.getItem("sherif-admin-auth");

    console.log("Auth status:", isAuth); // ✅ debug

    if (isAuth === "true") {
      navigate("/admin/dashboard", { replace: true }); // ✅ safer navigation
    } else {
      setCheckedAuth(true); // ✅ allow rendering only after check
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "admin" && password === "sherif2026") {
      localStorage.setItem("sherif-admin-auth", "true");
      navigate("/admin/dashboard", { replace: true }); // ✅ improved
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  // ✅ prevent flicker / unwanted redirect before auth check
  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="p-8 border rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label>Username</label>
              <div className="relative">
                <User className="absolute left-2 top-3 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-8 p-2 border rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <Lock className="absolute left-2 top-3 w-4 h-4" />
                <input
                  type="password"
                  className="w-full pl-8 p-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button className="w-full bg-black text-white p-2 rounded">
              Login
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}