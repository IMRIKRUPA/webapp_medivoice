import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  dosage: "",
  frequency: "",
  startDate: "",
  endDate: "",
  timeSlots: "",
  instructions: "",
  status: "active",
};

function MedicationForm({ initialValues, onCancel, onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!initialValues) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: initialValues.name || "",
      dosage: initialValues.dosage || "",
      frequency: initialValues.frequency || "",
      startDate: initialValues.startDate || "",
      endDate: initialValues.endDate || "",
      timeSlots: (initialValues.timeSlots || []).join(", "),
      instructions: initialValues.instructions || "",
      status: initialValues.status || "active",
    });
  }, [initialValues]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name,
      dosage: form.dosage,
      frequency: form.frequency,
      startDate: form.startDate,
      endDate: form.endDate || null,
      timeSlots: form.timeSlots
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      instructions: form.instructions,
      status: form.status,
    });
  };

  return (
    <form className="card section-card" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <div>
          <h3>{initialValues ? "Update Medication" : "Add Medication"}</h3>
          <p className="section-subtext">Time slots must be sent as a string array to the backend.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="field-row">
          <label>Medication Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Dosage</label>
          <input
            className="input"
            value={form.dosage}
            onChange={(event) => updateField("dosage", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Frequency</label>
          <input
            className="input"
            value={form.frequency}
            onChange={(event) => updateField("frequency", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Time Slots</label>
          <input
            className="input"
            placeholder="09:00, 21:00"
            value={form.timeSlots}
            onChange={(event) => updateField("timeSlots", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>Start Date</label>
          <input
            className="input"
            type="date"
            value={form.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            required
          />
        </div>
        <div className="field-row">
          <label>End Date</label>
          <input
            className="input"
            type="date"
            value={form.endDate || ""}
            onChange={(event) => updateField("endDate", event.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Status</label>
          <select
            className="select"
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      </div>

      <div className="field-row" style={{ marginTop: 16 }}>
        <label>Instructions</label>
        <textarea
          className="textarea"
          value={form.instructions}
          onChange={(event) => updateField("instructions", event.target.value)}
        />
      </div>

      <div className="inline-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Saving..." : initialValues ? "Update Medication" : "Create Medication"}
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

export default MedicationForm;
