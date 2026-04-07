import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertBanner from "../components/AlertBanner";
import ChatComposer from "../components/ChatComposer";
import ChatWindow from "../components/ChatWindow";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import QuickActionButtons from "../components/QuickActionButtons";
import SymptomChecker from "../components/SymptomChecker";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { sendChatMessage } from "../services/chatService";
import { getChatHistory } from "../services/historyService";
import { extractApiError } from "../utils/apiHelpers";
import { formatDateTime } from "../utils/formatters";

function ChatPage() {
  const { patientId } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [historyLoading, setHistoryLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [contextType, setContextType] = useState("symptom");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [latestQuickActions, setLatestQuickActions] = useState([
    "Analyze Symptoms",
    "Book Appointment",
    "View History",
  ]);

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true);
      setErrorMessage("");

      try {
        const response = await getChatHistory({ patientId, limit: 20 });
        const mappedMessages = (response.data || [])
          .slice()
          .reverse()
          .flatMap((entry) => [
            {
              id: `user-${entry.id}`,
              sender: "user",
              text: entry.userMessage,
              timestamp: formatDateTime(entry.createdAt),
            },
            {
              id: `bot-${entry.id}`,
              sender: "bot",
              text: entry.botReply,
              timestamp: formatDateTime(entry.createdAt),
            },
          ]);
        setMessages(mappedMessages);
      } catch (error) {
        setErrorMessage(extractApiError(error).message);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (patientId) {
      loadHistory();
    }
  }, [patientId]);

  const pageActions = useMemo(
    () => (
      <>
        <button
          type="button"
          className="button-secondary"
          onClick={() => {
            setContextType("greeting");
            setMessage("Hello");
          }}
        >
          Start Greeting
        </button>
        <button
          type="button"
          className="button-ghost"
          onClick={() => navigate("/history")}
        >
          Open History
        </button>
      </>
    ),
    [navigate],
  );

  const handleAction = (action) => {
    if (action.includes("Appointment")) {
      navigate("/appointments");
      return;
    }
    if (action.includes("Medication")) {
      navigate("/medications");
      return;
    }
    if (action.includes("History")) {
      navigate("/history");
      return;
    }
    if (action.includes("Insights")) {
      navigate("/insights");
      return;
    }
    if (action.includes("Tips")) {
      navigate("/dashboard");
      return;
    }

    if (action.includes("Emergency")) {
      setContextType("emergency");
      setMessage("I need an emergency check for severe symptoms.");
      return;
    }

    setContextType("symptom");
    setMessage("Please help analyze my symptoms.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please enter a message before sending.");
      return;
    }

    setSending(true);
    setErrorMessage("");

    const optimisticUserMessage = {
      id: `user-local-${Date.now()}`,
      sender: "user",
      text: message.trim(),
      timestamp: "Just now",
    };

    setMessages((current) => [...current, optimisticUserMessage]);

    try {
      const response = await sendChatMessage({
        patientId,
        message: message.trim(),
        inputType: "text",
        contextType,
      });

      const botReply = response.data.reply;
      setMessages((current) => [
        ...current,
        {
          id: `bot-${response.data.chatId}`,
          sender: "bot",
          text: botReply.text,
          timestamp: formatDateTime(response.data.createdAt),
          riskLevel: botReply.riskLevel,
          disclaimer: botReply.disclaimer,
        },
      ]);
      setLatestQuickActions(botReply.quickActions || []);
      setMessage("");
      addToast({
        title: "Reply received",
        message: response.message,
        type: "success",
      });
    } catch (error) {
      setMessages((current) => current.filter((item) => item.id !== optimisticUserMessage.id));
      setErrorMessage(extractApiError(error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Healthcare Chatbot"
        description="Send patient questions to the backend chatbot endpoint, use voice-to-text when supported, and trigger symptom analysis from the side panel."
        actions={pageActions}
      />

      <AlertBanner type="error" message={errorMessage} />

      <div className="chat-layout">
        <div className="card chat-window">
          <div className="card-inner">
            <div className="section-title-row">
              <div>
                <h3>Conversation</h3>
                <p className="section-subtext">
                  This page uses `POST /api/chat/message` and `GET /api/history/chat` exactly as defined in the backend contract.
                </p>
              </div>
            </div>

            <QuickActionButtons actions={latestQuickActions} onAction={handleAction} />
          </div>

          {historyLoading ? (
            <div className="card-inner">
              <EmptyState title="Loading chat history" description="Preparing your latest conversation..." />
            </div>
          ) : (
            <ChatWindow messages={messages} />
          )}

          <ChatComposer
            contextType={contextType}
            message={message}
            loading={sending}
            onContextChange={setContextType}
            onMessageChange={setMessage}
            onVoiceTranscript={(transcript) => setMessage((current) => `${current} ${transcript}`.trim())}
            onSubmit={handleSubmit}
          />
        </div>

        <SymptomChecker patientId={patientId} onToast={addToast} />
      </div>
    </>
  );
}

export default ChatPage;
