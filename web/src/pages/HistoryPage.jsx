import { useEffect, useState } from "react";
import { ClipboardList, MessageSquareMore } from "lucide-react";

import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { getChatHistory, getHealthHistory } from "../services/historyService";
import { extractApiError } from "../utils/apiHelpers";
import { formatDateTime } from "../utils/formatters";

function HistoryPage() {
  const { patientId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [healthHistory, setHealthHistory] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [chatResponse, healthResponse] = await Promise.all([
          getChatHistory({ patientId, limit: 20 }),
          getHealthHistory({ patientId, limit: 20 }),
        ]);
        setChatHistory(chatResponse.data || []);
        setHealthHistory(healthResponse.data);
      } catch (error) {
        setErrorMessage(extractApiError(error).message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      loadHistory();
    }
  }, [patientId]);

  if (loading) {
    return <LoadingSpinner label="Loading history..." />;
  }

  if (errorMessage) {
    return <EmptyState title="Unable to load history" description={errorMessage} />;
  }

  return (
    <>
      <PageHeader
        title="History"
        description="Review saved chat sessions, symptom logs, appointments, and medications using the backend history endpoints."
      />

      <div className="history-grid">
        <div className="card section-card">
          <div className="section-title-row">
            <div>
              <h3>Chat History</h3>
              <p className="section-subtext">Pulled from `GET /api/history/chat`.</p>
            </div>
            <div className="icon-wrap">
              <MessageSquareMore size={20} />
            </div>
          </div>

          {chatHistory.length ? (
            <div className="list">
              {chatHistory.map((entry) => (
                <div key={entry.id} className="list-item">
                  <p>
                    <strong>User:</strong> {entry.userMessage}
                  </p>
                  <p>
                    <strong>Bot:</strong> {entry.botReply}
                  </p>
                  <div className="list-item-footer">
                    <div className="pill-group">
                      <StatusBadge value={entry.inputType} />
                      <StatusBadge value={entry.contextType} />
                    </div>
                    <span className="muted">{formatDateTime(entry.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No chat history yet" description="Start a chatbot conversation to populate this section." />
          )}
        </div>

        <div className="card section-card">
          <div className="section-title-row">
            <div>
              <h3>Health History</h3>
              <p className="section-subtext">Pulled from `GET /api/history/health` with grouped sections.</p>
            </div>
            <div className="icon-wrap">
              <ClipboardList size={20} />
            </div>
          </div>

          <div className="list">
            <div className="list-item">
              <h4>Symptom Logs</h4>
              {healthHistory?.symptomLogs?.length ? (
                healthHistory.symptomLogs.map((log) => (
                  <div key={log.id} style={{ marginTop: 14 }}>
                    <div className="list-item-header">
                      <p>{(log.symptoms || []).join(", ")}</p>
                      <StatusBadge value={log.urgency} />
                    </div>
                    <p>{formatDateTime(log.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="muted">No symptom logs yet.</p>
              )}
            </div>

            <div className="list-item">
              <h4>Appointments</h4>
              {healthHistory?.appointments?.length ? (
                healthHistory.appointments.map((appointment) => (
                  <div key={appointment.id} style={{ marginTop: 14 }}>
                    <div className="list-item-header">
                      <p>{appointment.doctorName}</p>
                      <StatusBadge value={appointment.status} />
                    </div>
                    <p>{formatDateTime(appointment.appointmentDateTime)}</p>
                  </div>
                ))
              ) : (
                <p className="muted">No appointment history yet.</p>
              )}
            </div>

            <div className="list-item">
              <h4>Medications</h4>
              {healthHistory?.medications?.length ? (
                healthHistory.medications.map((medication) => (
                  <div key={medication.id} className="list-item-header" style={{ marginTop: 14 }}>
                    <p>{medication.name}</p>
                    <StatusBadge value={medication.status} />
                  </div>
                ))
              ) : (
                <p className="muted">No medication history yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HistoryPage;
