import EmptyState from "./EmptyState";
import MessageBubble from "./MessageBubble";

function ChatWindow({ messages }) {
  if (!messages.length) {
    return (
      <EmptyState
        title="No chat yet"
        description="Start a conversation to check symptoms, review medications, or schedule an appointment."
      />
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          sender={message.sender}
          text={message.text}
          timestamp={message.timestamp}
          riskLevel={message.riskLevel}
          disclaimer={message.disclaimer}
        />
      ))}
    </div>
  );
}

export default ChatWindow;
