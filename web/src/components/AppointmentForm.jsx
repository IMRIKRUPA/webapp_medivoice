import { useEffect, useState } from "react";

import { inputDateTimeToIso, isoToInputDateTime } from "../utils/formatters";

const initialForm = {
  doctorName: "",
  specialistType: "General Physician",
  appointmentDateTime: "",
  location: "",
  reason: "",
  notes: "",
  status: "scheduled",
};

function AppointmentForm({ initialValues, onCancel, onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!initialValues) {
      setForm(initialForm);
      return;
    }

    setForm({
      doctorName: initialValues.doctorName || "",
      specialistType: initialValues.specialistType || "General Physician",
      appointmentDateTime: isoToInputDateTime(initialValues.appointmentDateTime),
      location: initialValues.location || "",
      reason: initialValues.reason || "",
      notes: initialValues.notes || "",
      status: initialValues.status || "scheduled",
    });
  }, [initialValues]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      doctorName: form.doctorName,
      specialistType: form.specialistType,
      appointmentDateTime: inputDateTimeToIso(form.appointmentDateTime),
      location: form.location,
      reason: form.reason,
      notes: form.notes,
      status: form.status,
    });
  };

  return (
    <form className="card section-card" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <div>
          <h3>{initialValues ? "Edit Appointment" : "Schedule Appointment"}</h3>
          <p className="section-subtext">Use only the fields supported by the backend contract.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="field-row">
          <label>Doctor Name</label>
          <input
            className="input"
            value={form.doctorName}
            onChange={(event) => updateField("doctorName", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Specialist Type</label>
          <input
            className="input"
            value={form.specialistType}
            onChange={(event) => updateField("specialistType", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Date and Time</label>
          <input
            className="input"
            type="datetime-local"
            value={form.appointmentDateTime}
            onChange={(event) => updateField("appointmentDateTime", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Location</label>
          <input
            className="input"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Reason</label>
          <input
            className="input"
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Status</label>
          <select
            className="select"
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="field-row" style={{ marginTop: 16 }}>
        <label>Notes</label>
        <textarea
          className="textarea"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
        />
      </div>

      <div className="inline-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Saving..." : initialValues ? "Update Appointment" : "Create Appointment"}
        </button>
        {initialValues ? (
          <button type="button" className="button-ghost" onClick={onCancel}>
            Cancel Edit
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default AppointmentForm;
