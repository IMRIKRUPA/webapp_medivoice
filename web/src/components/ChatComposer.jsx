import { SendHorizontal } from "lucide-react";

import VoiceInputButton from "./VoiceInputButton";

function ChatComposer({
  contextType,
  message,
  loading,
  onContextChange,
  onMessageChange,
  onVoiceTranscript,
  onSubmit,
}) {
  return (
    <form className="composer" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="field-row">
          <label htmlFor="contextType">Conversation Type</label>
          <select
            id="contextType"
            className="select"
            value={contextType}
            onChange={(event) => onContextChange(event.target.value)}
          >
            <option value="symptom">Symptom</option>
            <option value="appointment">Appointment</option>
            <option value="medication">Medication</option>
            <option value="history">History</option>
            <option value="insights">Insights</option>
            <option value="emergency">Emergency</option>
            <option value="greeting">Greeting</option>
          </select>
        </div>

        <div className="field-row">
          <label>Voice Input</label>
          <VoiceInputButton onTranscript={onVoiceTranscript} />
        </div>
      </div>

      <div className="field-row">
        <label htmlFor="chatMessage">Message</label>
        <textarea
          id="chatMessage"
          className="textarea"
          placeholder="Describe symptoms, ask about medications, or request an appointment..."
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
        />
      </div>

      <div className="inline-actions">
        <button type="submit" className="button" disabled={loading}>
          <SendHorizontal size={16} />
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}

export default ChatComposer;
