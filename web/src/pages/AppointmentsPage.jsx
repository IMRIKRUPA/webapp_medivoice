import { useEffect, useState } from "react";
import { CalendarDays, PencilLine, Trash2 } from "lucide-react";

import AlertBanner from "../components/AlertBanner";
import AppointmentForm from "../components/AppointmentForm";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../services/appointmentService";
import { extractApiError } from "../utils/apiHelpers";
import { formatDateTime } from "../utils/formatters";

function AppointmentsPage() {
  const { patientId } = useAuth();
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState(null);

  const loadAppointments = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getAppointments({ patientId });
      setAppointments(response.data || []);
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadAppointments();
    }
  }, [patientId]);

  const handleSubmit = async (formPayload) => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (editing) {
        const response = await updateAppointment(editing.id, formPayload);
        addToast({
          title: "Appointment updated",
          message: response.message,
          type: "success",
        });
        setEditing(null);
      } else {
        const response = await createAppointment({
          patientId,
          doctorName: formPayload.doctorName,
          specialistType: formPayload.specialistType,
          appointmentDateTime: formPayload.appointmentDateTime,
          location: formPayload.location,
          reason: formPayload.reason,
          notes: formPayload.notes,
        });
        addToast({
          title: "Appointment created",
          message: response.message,
          type: "success",
        });
      }

      await loadAppointments();
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    setErrorMessage("");

    try {
      const response = await deleteAppointment(appointmentId);
      addToast({
        title: "Appointment removed",
        message: response.message,
        type: "info",
      });
      await loadAppointments();
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    }
  };

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Create, view, update, and delete appointments using the exact appointment contract fields and response structure."
      />

      <div className="grid-two">
        <AppointmentForm
          initialValues={editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        <div className="card section-card">
          <div className="section-title-row">
            <div>
              <h3>Scheduled Visits</h3>
              <p className="section-subtext">The list below is powered by `GET /api/appointments`.</p>
            </div>
            <div className="icon-wrap">
              <CalendarDays size={20} />
            </div>
          </div>

          <AlertBanner type="error" message={errorMessage} />

          {loading ? (
            <LoadingSpinner label="Loading appointments..." />
          ) : appointments.length ? (
            <div className="list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="list-item">
                  <div className="list-item-header">
                    <div>
                      <h4>{appointment.doctorName}</h4>
                      <p>{appointment.specialistType}</p>
                    </div>
                    <StatusBadge value={appointment.status} />
                  </div>
                  <p>
                    <strong>When:</strong> {formatDateTime(appointment.appointmentDateTime)}
                  </p>
                  <p>
                    <strong>Location:</strong> {appointment.location || "Not provided"}
                  </p>
                  <p>
                    <strong>Reason:</strong> {appointment.reason || "Not provided"}
                  </p>
                  <p>
                    <strong>Notes:</strong> {appointment.notes || "Not provided"}
                  </p>
                  <div className="list-item-footer" style={{ marginTop: 14 }}>
                    <span className="muted">Created: {formatDateTime(appointment.createdAt)}</span>
                    <div className="inline-actions">
                      <button type="button" className="button-secondary" onClick={() => setEditing(appointment)}>
                        <PencilLine size={16} />
                        Edit
                      </button>
                      <button type="button" className="button-danger" onClick={() => handleDelete(appointment.id)}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No appointments yet" description="Create your first appointment using the form." />
          )}
        </div>
      </div>
    </>
  );
}

export default AppointmentsPage;
