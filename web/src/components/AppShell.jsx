import { Activity, CalendarDays, History, LayoutDashboard, LogOut, MessageSquareText, Pill } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "Chatbot", icon: MessageSquareText },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/medications", label: "Medications", icon: Pill },
  { to: "/insights", label: "Insights", icon: Activity },
  { to: "/history", label: "History", icon: History },
];

function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={22} />
          </div>
          <div className="brand-copy">
            <h1>MediVoice AI</h1>
            <p>Healthcare assistant</p>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <h3>{user?.fullName || "Signed in"}</h3>
          <p>{user?.email || "Connected to the MediVoice backend"}</p>
          <button type="button" className="button-secondary" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
