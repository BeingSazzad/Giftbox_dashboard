import { useState } from "react";
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { useLoginMutation } from "../store/services/auth.api";
import { toast } from "sonner";
import { validateEmail } from "../helper/validateEmail";
import { useNavigate } from "react-router-dom";
import { setToLocalStorage, TOKEN_STORAGE_KEY } from "../utils/local-storage";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [login, { isLoading }] = useLoginMutation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 6 + 4,
    })),
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (emailError) return;

    await login({ identifier, password })
      .unwrap()
      .then((res) => {
        if (res?.data?.token) {
          setToLocalStorage(TOKEN_STORAGE_KEY, res.data.token);
        }
        toast.success("Login successful! Redirecting...");
        navigate("/dashboard");
        onLogin();
      });
  };

  return (
    <div className="login-page">
      {/* Background */}
      <div className="login-bg-orb one" />
      <div className="login-bg-orb two" />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.6)",
            opacity: p.opacity,
            pointerEvents: "none",
            animation: `pulse ${p.duration}s ease-in-out infinite`,
          }}
        />
      ))}

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img src="/logo.png" alt="Logo" className="login-logo-icon" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>
              Gift<span style={{ color: "gold" }}>Box</span>
            </div>
            <div style={{ fontSize: 11 }}>ADMIN PORTAL</div>
          </div>
        </div>

        <h1 className="login-heading">Welcome back 👋</h1>
        <p className="login-sub">Sign in to manage your system</p>

        {/* Error */}
        {error && <div className="error-box">{error}</div>}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Identifier */}
          <div className="form-group">
            <label>Email / Phone</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your email"
              value={identifier}
              onChange={(e) => {
                const value = e.target.value;
                setIdentifier(value);

                if (!value) {
                  setEmailError("Email is required");
                } else if (!validateEmail(value)) {
                  setEmailError("Invalid email format");
                } else {
                  setEmailError("");
                }
              }}
            />
            {emailError && (
              <p style={{ color: "red", fontSize: 12 }}>{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <ArrowRight size={16} /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
