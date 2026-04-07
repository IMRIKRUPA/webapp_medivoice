import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginUser, registerUser } from "../services/authService";
import { extractApiError } from "../utils/apiHelpers";

const loginInitial = {
  email: "",
  password: "",
};

const registerInitial = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  dateOfBirth: "",
  gender: "female",
};

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = useMemo(() => location.state?.from || "/dashboard", [location.state]);

  const updateLogin = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegister = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUser(loginForm);
      login({
        token: response.data.token,
        user: response.data.user,
        patientId: response.data.patientId,
      });
      addToast({
        title: "Welcome back",
        message: response.message,
        type: "success",
      });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await registerUser(registerForm);
      login({
        token: response.data.token,
        user: response.data.user,
        patientId: response.data.patient.id,
      });
      addToast({
        title: "Account created",
        message: response.message,
        type: "success",
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-side">
        <div className="brand" style={{ marginBottom: 18 }}>
          <div className="brand-mark">
            <Activity size={22} />
          </div>
          <div className="brand-copy">
            <h1 style={{ margin: 0, fontSize: "1.15rem" }}>MediVoice AI</h1>
            <p style={{ color: "rgba(255,255,255,0.72)" }}>Healthcare Assistant Chatbot</p>
          </div>
        </div>

        <h1>Sign in for your care dashboard.</h1>
        <p>
          Use the seeded backend accounts for demo mode or create a new patient profile. The frontend stores the token,
          patient ID, and user details exactly as returned by the backend contract.
        </p>

        <div className="surface-strip">
          <div className="mini-card">
            <strong>Chat + Voice</strong>
            Symptom and support conversations in one place.
          </div>
          <div className="mini-card">
            <strong>Appointments</strong>
            Manage visits and follow-ups with exact API fields.
          </div>
          <div className="mini-card">
            <strong>Medication</strong>
            Track schedules, alerts, and health history.
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="card auth-card">
          <div className="tab-row">
            <button
              type="button"
              className={`tab-button ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`tab-button ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <AlertBanner type="error" message={errorMessage} />

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="field-row">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => updateLogin("email", event.target.value)}
                  required
                />
              </div>
              <div className="field-row" style={{ marginTop: 14 }}>
                <label>Password</label>
                <input
                  className="input"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => updateLogin("password", event.target.value)}
                  required
                />
              </div>
              <div className="inline-actions" style={{ marginTop: 18 }}>
                <button type="submit" className="button" disabled={loading}>
                  {loading ? "Signing In..." : "Login"}
                </button>
              </div>
              <p className="footer-note" style={{ marginTop: 18 }}>
                Demo seed example: `aarav@example.com` / `Password123`
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-grid">
                <div className="field-row">
                  <label>Full Name</label>
                  <input
                    className="input"
                    value={registerForm.fullName}
                    onChange={(event) => updateRegister("fullName", event.target.value)}
                    required
                  />
                </div>
                <div className="field-row">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    value={registerForm.email}
                    onChange={(event) => updateRegister("email", event.target.value)}
                    required
                  />
                </div>
                <div className="field-row">
                  <label>Password</label>
                  <input
                    className="input"
                    type="password"
                    value={registerForm.password}
                    onChange={(event) => updateRegister("password", event.target.value)}
                    required
                  />
                </div>
                <div className="field-row">
                  <label>Phone</label>
                  <input
                    className="input"
                    value={registerForm.phone}
                    onChange={(event) => updateRegister("phone", event.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Date of Birth</label>
                  <input
                    className="input"
                    type="date"
                    value={registerForm.dateOfBirth}
                    onChange={(event) => updateRegister("dateOfBirth", event.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Gender</label>
                  <select
                    className="select"
                    value={registerForm.gender}
                    onChange={(event) => updateRegister("gender", event.target.value)}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="inline-actions" style={{ marginTop: 18 }}>
                <button type="submit" className="button" disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default AuthPage;
