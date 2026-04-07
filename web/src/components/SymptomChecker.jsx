import { useMemo, useState } from "react";
import { ActivitySquare } from "lucide-react";

import { analyzeSymptoms } from "../services/symptomService";
import { getEmergencyCheck } from "../services/emergencyService";
import { extractApiError } from "../utils/apiHelpers";
import AlertBanner from "./AlertBanner";
import StatusBadge from "./StatusBadge";

const initialForm = {
  symptoms: "",
  durationDays: "1",
  severity: "low",
  notes: "",
};

function SymptomChecker({ patientId, onToast }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [emergencyResult, setEmergencyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const symptomArray = useMemo(
    () =>
      form.symptoms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.symptoms],
  );

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setEmergencyResult(null);

    try {
      const payload = {
        patientId,
        symptoms: symptomArray,
        durationDays: Number(form.durationDays),
        severity: form.severity,
        notes: form.notes,
      };
      const response = await analyzeSymptoms(payload);
      setResult(response.data);
      onToast({
        title: "Symptoms analyzed",
        message: response.message,
        type: "success",
      });
    } catch (error) {
      const apiError = extractApiError(error);
      setErrorMessage(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCheck = async () => {
    if (!symptomArray.length) {
      setErrorMessage("Enter symptoms first to run the emergency check.");
      return;
    }

    setEmergencyLoading(true);
    setErrorMessage("");

    try {
      const response = await getEmergencyCheck({
        symptoms: symptomArray,
        severity: form.severity,
      });
      setEmergencyResult(response.data);
      onToast({
        title: response.data.isEmergency ? "High-risk symptoms" : "Emergency check complete",
        message: response.message,
        type: response.data.isEmergency ? "error" : "info",
      });
    } catch (error) {
      const apiError = extractApiError(error);
      setErrorMessage(apiError.message);
    } finally {
      setEmergencyLoading(false);
    }
  };

  return (
    <div className="card section-card">
      <div className="section-title-row">
        <div>
          <h3>Symptom Analysis</h3>
          <p className="section-subtext">
            Send structured symptoms to the backend and display urgency, recommendation, and specialist type.
          </p>
        </div>
        <div className="icon-wrap">
          <ActivitySquare size={20} />
        </div>
      </div>

      <AlertBanner type="error" message={errorMessage} />

      <form className="form-grid" onSubmit={handleAnalyze}>
        <div className="field-row">
          <label htmlFor="symptoms">Symptoms</label>
          <input
            id="symptoms"
            className="input"
            placeholder="fever, headache, cough"
            value={form.symptoms}
            onChange={(event) => handleChange("symptoms", event.target.value)}
          />
        </div>
        <div className="field-row">
          <label htmlFor="durationDays">Duration (days)</label>
          <input
            id="durationDays"
            className="input"
            type="number"
            min="1"
            value={form.durationDays}
            onChange={(event) => handleChange("durationDays", event.target.value)}
          />
        </div>
        <div className="field-row">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            className="select"
            value={form.severity}
            onChange={(event) => handleChange("severity", event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="notes">Notes</label>
          <input
            id="notes"
            className="input"
            placeholder="No breathing issues"
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
          />
        </div>

        <div className="inline-actions">
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Symptoms"}
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={handleEmergencyCheck}
            disabled={emergencyLoading}
          >
            {emergencyLoading ? "Checking..." : "Emergency Check"}
          </button>
        </div>
      </form>

      {result ? (
        <div className="list-item" style={{ marginTop: 18 }}>
          <div className="list-item-header">
            <h4>{result.conditionCategory}</h4>
            <StatusBadge value={result.urgency} />
          </div>
          <p>
            <strong>Recommendation:</strong> {result.recommendation}
          </p>
          <p>
            <strong>Specialist:</strong> {result.specialistType}
          </p>
          <p>
            <strong>Disclaimer:</strong> {result.disclaimer}
          </p>
        </div>
      ) : null}

      {emergencyResult ? (
        <div className="list-item" style={{ marginTop: 18 }}>
          <div className="list-item-header">
            <h4>Emergency Check</h4>
            <StatusBadge value={emergencyResult.riskLevel} />
          </div>
          <p>{emergencyResult.advice}</p>
          <p>
            <strong>Disclaimer:</strong> {emergencyResult.disclaimer}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default SymptomChecker;
