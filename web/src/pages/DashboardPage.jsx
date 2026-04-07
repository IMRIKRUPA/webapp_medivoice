import { useEffect, useState } from "react";
import { CalendarDays, HeartPulse, Pill, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardCard from "../components/DashboardCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAppointments } from "../services/appointmentService";
import { getInsights } from "../services/insightService";
import { getMedications } from "../services/medicationService";
import { getPatient } from "../services/patientService";
import { getDailyTip } from "../services/tipService";
import { extractApiError } from "../utils/apiHelpers";
import { formatDate, formatDateTime } from "../utils/formatters";

function DashboardPage() {
  const { patientId } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [insights, setInsights] = useState(null);
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [patientResponse, appointmentsResponse, medicationsResponse, insightsResponse, tipResponse] =
          await Promise.all([
            getPatient(patientId),
            getAppointments({ patientId }),
            getMedications({ patientId, active: true }),
            getInsights({ patientId, range: "30d" }),
            getDailyTip(),
          ]);

        setPatient(patientResponse.data);
        setAppointments(appointmentsResponse.data || []);
        setMedications(medicationsResponse.data || []);
        setInsights(insightsResponse.data);
        setTip(tipResponse.data);
      } catch (error) {
        const apiError = extractApiError(error);
        setErrorMessage(apiError.message);
        addToast({
          title: "Dashboard unavailable",
          message: apiError.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      loadDashboard();
    }
  }, [addToast, patientId]);

  if (loading) {
    return <LoadingSpinner label="Loading your patient dashboard..." />;
  }

  if (errorMessage) {
    return <EmptyState title="Unable to load dashboard" description={errorMessage} />;
  }

  const upcomingAppointment = appointments[0];

  return (
    <>
      <PageHeader
        title={`Welcome, ${patient?.fullName || "Patient"}`}
        description="Review your healthcare summary, current records, daily tip, and latest health trends from the connected backend."
        actions={
          <>
            <Link to="/chat" className="button">
              Open Chatbot
            </Link>
            <Link to="/appointments" className="button-secondary">
              Manage Appointments
            </Link>
          </>
        }
      />

      <div className="dashboard-grid">
        <DashboardCard
          icon={<CalendarDays size={20} />}
          label="Appointments"
          value={appointments.length}
          helper={upcomingAppointment ? `Next: ${formatDateTime(upcomingAppointment.appointmentDateTime)}` : "No appointments yet"}
        />
        <DashboardCard
          icon={<Pill size={20} />}
          label="Active Medications"
          value={medications.length}
          helper="Current medication tracker entries"
        />
        <DashboardCard
          icon={<HeartPulse size={20} />}
          label="Adherence"
          value={`${insights?.medicationAdherence?.percentage || 0}%`}
          helper="Taken vs missed reminders from the backend insights data"
        />
        <DashboardCard
          icon={<ShieldCheck size={20} />}
          label="Risk Snapshot"
          value={insights?.commonSymptoms?.[0]?.symptom || "Stable"}
          helper="Most common symptom from recent health history"
        />
      </div>

      <div className="grid-two">
        <div className="card section-card">
          <div className="section-title-row">
            <div>
              <h3>Patient Profile</h3>
              <p className="section-subtext">This section mirrors the patient record returned by `GET /api/patient/&lt;id&gt;`.</p>
            </div>
          </div>

          <div className="info-grid">
            <div>
              <strong>Blood Group</strong>
              <p>{patient?.bloodGroup || "Not available"}</p>
            </div>
            <div>
              <strong>Date of Birth</strong>
              <p>{formatDate(patient?.dateOfBirth)}</p>
            </div>
            <div>
              <strong>Gender</strong>
              <p>{patient?.gender || "Not available"}</p>
            </div>
            <div>
              <strong>Height</strong>
              <p>{patient?.heightCm ? `${patient.heightCm} cm` : "Not available"}</p>
            </div>
            <div>
              <strong>Weight</strong>
              <p>{patient?.weightKg ? `${patient.weightKg} kg` : "Not available"}</p>
            </div>
            <div>
              <strong>Phone</strong>
              <p>{patient?.phone || "Not available"}</p>
            </div>
          </div>

          <div className="history-grid" style={{ marginTop: 18 }}>
            <div className="list-item">
              <h4>Medical History</h4>
              <p>
                <strong>Allergies:</strong> {patient?.allergies || "None recorded"}
              </p>
              <p>
                <strong>Chronic Conditions:</strong> {patient?.chronicConditions || "None recorded"}
              </p>
              <p>
                <strong>Current Medications:</strong> {patient?.currentMedications || "None recorded"}
              </p>
            </div>
            <div className="list-item">
              <h4>Emergency Contact</h4>
              <p>
                <strong>Name:</strong> {patient?.emergencyContactName || "Not available"}
              </p>
              <p>
                <strong>Phone:</strong> {patient?.emergencyContactPhone || "Not available"}
              </p>
              <p>
                <strong>Address:</strong> {patient?.address || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="card section-card">
          <div className="section-title-row">
            <div>
              <h3>Daily Health Tip</h3>
              <p className="section-subtext">Loaded from `GET /api/tips/daily` for demo-ready dashboard content.</p>
            </div>
          </div>

          {tip ? (
            <div className="list-item">
              <div className="list-item-header">
                <h4>{tip.title}</h4>
                <StatusBadge value={tip.category} />
              </div>
              <p>{tip.tip}</p>
              <p>
                <strong>Date:</strong> {formatDate(tip.date)}
              </p>
            </div>
          ) : (
            <EmptyState title="No daily tip" description="The backend did not return a tip for today." />
          )}

          <div className="list-item" style={{ marginTop: 18 }}>
            <h4>Recent Trend Summary</h4>
            <p>
              <strong>Top symptoms:</strong>{" "}
              {insights?.commonSymptoms?.length
                ? insights.commonSymptoms.slice(0, 3).map((item) => item.symptom).join(", ")
                : "No symptom data yet"}
            </p>
            <p>
              <strong>Weekly activity:</strong>{" "}
              {insights?.weeklyHealthActivity?.reduce((sum, item) => sum + item.activityCount, 0) || 0} tracked actions
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
