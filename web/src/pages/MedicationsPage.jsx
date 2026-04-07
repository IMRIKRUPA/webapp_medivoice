import { useEffect, useState } from "react";
import { PencilLine, Pill } from "lucide-react";

import AlertBanner from "../components/AlertBanner";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import MedicationForm from "../components/MedicationForm";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  createMedication,
  getMedications,
  updateMedication,
} from "../services/medicationService";
import { extractApiError } from "../utils/apiHelpers";
import { formatDate } from "../utils/formatters";

function MedicationsPage() {
  const { patientId } = useAuth();
  const { addToast } = useToast();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState(null);

  const loadMedications = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getMedications({ patientId });
      setMedications(response.data || []);
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadMedications();
    }
  }, [patientId]);

  const handleSubmit = async (formPayload) => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (editing) {
        const response = await updateMedication(editing.id, formPayload);
        addToast({
          title: "Medication updated",
          message: response.message,
          type: "success",
        });
        setEditing(null);
      } else {
        const response = await createMedication({
          patientId,
          name: formPayload.name,
          dosage: formPayload.dosage,
          frequency: formPayload.frequency,
          startDate: formPayload.startDate,
          endDate: formPayload.endDate,
          timeSlots: formPayload.timeSlots,
          instructions: formPayload.instructions,
        });
        addToast({
          title: "Medication created",
          message: response.message,
          type: "success",
        });
      }

      await loadMedications();
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Medication Tracker"
        description="Create and update medications, time slots, and adherence-ready entries using only the supported backend fields."
      />

      <div className="grid-two">
        <MedicationForm
          initialValues={editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        <div className="card section-card">
          <div className="section-title-row">
            <div>
              <h3>Medication List</h3>
              <p className="section-subtext">Connected to `GET /api/medications` and `PUT /api/medications/&lt;id&gt;`.</p>
            </div>
            <div className="icon-wrap">
              <Pill size={20} />
            </div>
          </div>

          <AlertBanner type="error" message={errorMessage} />

          {loading ? (
            <LoadingSpinner label="Loading medications..." />
          ) : medications.length ? (
            <div className="list">
              {medications.map((medication) => (
                <div key={medication.id} className="list-item">
                  <div className="list-item-header">
                    <div>
                      <h4>{medication.name}</h4>
                      <p>
                        {medication.dosage} · {medication.frequency}
                      </p>
                    </div>
                    <StatusBadge value={medication.status} />
                  </div>
                  <p>
                    <strong>Dates:</strong> {formatDate(medication.startDate)} to {formatDate(medication.endDate)}
                  </p>
                  <p>
                    <strong>Time Slots:</strong> {(medication.timeSlots || []).join(", ") || "Not provided"}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {medication.instructions || "Not provided"}
                  </p>
                  <div className="list-item-footer" style={{ marginTop: 14 }}>
                    <span className="muted">Created: {formatDate(medication.createdAt)}</span>
                    <button type="button" className="button-secondary" onClick={() => setEditing(medication)}>
                      <PencilLine size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No medications yet" description="Add a medication to start tracking doses and time slots." />
          )}
        </div>
      </div>
    </>
  );
}

export default MedicationsPage;
