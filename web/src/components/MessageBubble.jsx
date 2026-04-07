import StatusBadge from "./StatusBadge";

function MessageBubble({ sender, text, timestamp, riskLevel, disclaimer }) {
  return (
    <div className={`message-row ${sender}`}>
      <div className={`message-bubble ${sender}`}>
        <div>{text}</div>
        <div className="message-meta">
          {riskLevel ? <StatusBadge value={riskLevel} /> : null}
          {timestamp ? <span>{timestamp}</span> : null}
        </div>
        {disclaimer && sender === "bot" ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            {disclaimer}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default MessageBubble;
