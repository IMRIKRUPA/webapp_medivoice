import { Activity, CalendarClock, PillBottle, ShieldPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <Activity size={20} />,
    title: "Symptom guidance",
    description: "Capture symptoms by text or voice and request a structured preliminary assessment from the backend.",
  },
  {
    icon: <CalendarClock size={20} />,
    title: "Appointment coordination",
    description: "View, create, update, and manage upcoming visits from a clean scheduler interface.",
  },
  {
    icon: <PillBottle size={20} />,
    title: "Medication tracking",
    description: "Monitor medicines, dosage schedules, time slots, and adherence-friendly reminders.",
  },
  {
    icon: <ShieldPlus size={20} />,
    title: "Health insights",
    description: "Turn backend health history into chart-ready views for symptoms, activity, and adherence.",
  },
];

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hero">
      <section className="hero-copy">
        <div className="brand" style={{ marginBottom: 26 }}>
          <div className="brand-mark">
            <Activity size={22} />
          </div>
          <div className="brand-copy">
            <h1 style={{ fontSize: "1.1rem" }}>MediVoice AI</h1>
            <p>Healthcare Assistant Chatbot</p>
          </div>
        </div>

        <h1>Care guidance, reminders, and records in one calm interface.</h1>
        <p>
          MediVoice AI helps patients and demo users move from symptoms to next actions faster with text chat, voice
          input, appointment planning, medication tracking, medical history, and chart-friendly health insights.
        </p>

        <div className="hero-actions">
          <Link to={isAuthenticated ? "/dashboard" : "/auth"} className="button">
            {isAuthenticated ? "Open Dashboard" : "Get Started"}
          </Link>
          <Link to="/chat" className="button-secondary">
            View Demo Chat
          </Link>
        </div>

        <div className="surface-strip" style={{ marginTop: 28 }}>
          <div className="mini-card">
            <strong>Text + Voice</strong>
            Hands-free symptom input for faster demos.
          </div>
          <div className="mini-card">
            <strong>Exact API Match</strong>
            Built against the agreed Flask contract.
          </div>
          <div className="mini-card">
            <strong>Web Ready</strong>
            Clean responsive UI for laptop presentation.
          </div>
        </div>
      </section>

      <section className="hero-grid">
        {features.map((feature) => (
          <div key={feature.title} className="card feature-card">
            <div className="icon-wrap">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;
