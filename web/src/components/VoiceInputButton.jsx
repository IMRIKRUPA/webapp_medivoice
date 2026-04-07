import { Mic, MicOff } from "lucide-react";

import useVoiceInput from "../hooks/useVoiceInput";

function VoiceInputButton({ onTranscript }) {
  const { isSupported, isListening, start, stop, error } = useVoiceInput({
    onTranscript,
  });

  if (!isSupported) {
    return (
      <div className="footer-note">Voice input is not supported in this browser.</div>
    );
  }

  return (
    <div className="inline-actions">
      <button
        type="button"
        className={`button-secondary voice-button ${isListening ? "listening" : ""}`}
        onClick={isListening ? stop : start}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        {isListening ? "Stop Listening" : "Voice Input"}
      </button>
      {error ? <div className="footer-note">{error}</div> : null}
    </div>
  );
}

export default VoiceInputButton;
