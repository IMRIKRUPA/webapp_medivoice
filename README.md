🩺 MediVoice AI – Healthcare Assistant Chatbot
📌 Overview

MediVoice AI is a cross-platform healthcare assistant chatbot designed to provide users with quick and accessible health-related support through both text and voice interaction. The application helps users manage basic healthcare needs such as symptom guidance, medication tracking, appointment management, and health insights in a simple and user-friendly way.

🎯 Problem Statement

Many individuals lack immediate access to basic healthcare assistance for everyday concerns like symptom understanding, medication reminders, and appointment tracking. Existing healthcare systems are often complex, time-consuming, and not easily accessible for regular users. There is a need for a simple, intelligent, and interactive system that can provide preliminary healthcare support efficiently.

💡 Solution

MediVoice AI addresses this gap by offering a smart assistant that allows users to interact using text or voice. The system analyzes user input, provides preliminary guidance, and helps manage healthcare activities such as appointments, medications, and health records through an intuitive interface.

🚀 Features
🔹 Core Features
Chat-based healthcare assistant
Voice input for natural interaction
Symptom analysis and preliminary suggestions
Appointment scheduling and tracking
Medication management and reminders
Patient records and medical history
Health insights dashboard
Daily health tips
🔹 Advanced Features
Voice-first assistant experience
Quick action suggestions
Risk/urgency indication for symptoms
Chat history tracking
User authentication and secure session handling
Cross-platform support (Web + Mobile)
🏗️ System Architecture
Frontend (Web & Mobile)
        ↓
Backend (Flask API)
        ↓
Database (SQLite / MongoDB)
Frontend handles user interaction and UI
Backend processes requests and business logic
Database stores user data, history, and records
🛠️ Tech Stack
Frontend (Web)
React.js
HTML, CSS, JavaScript
Mobile
React Native (Expo)
Backend
Python (Flask)
REST APIs
Database
SQLite / MongoDB
Additional Tools
Axios / Fetch API
AsyncStorage (Mobile)
Expo Go (Mobile testing)
📱 How It Works
User logs into the application
Interacts with chatbot via text or voice
Input is sent to backend API
Backend processes request and returns response
User receives insights, suggestions, or actions
Data is stored for history and tracking
🎤 Voice Assistant
Users can interact using voice input
Speech is converted to text
Text is processed like normal chat input
Enables hands-free interaction for better usability
🔐 Authentication & Security
Secure login and session handling
Token-based authentication
Protected API routes for user data
Safe storage of user session on device
📊 Use Cases
Quick symptom guidance
Checking medication schedules
Viewing upcoming appointments
Tracking health trends
Getting daily health recommendations
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/your-username/medivoice-ai.git
cd medivoice-ai
2. Run Backend
cd backend
pip install -r requirements.txt
python app.py
3. Run Web App
cd web
npm install
npm start
4. Run Mobile App
cd mobile
npm install
npx expo start
🌐 Deployment
Frontend can be deployed using:
Vercel / Netlify
Backend can be deployed using:
Render / Railway
🧪 Demo Credentials
Email: aarav@example.com
Password: Password123
📌 Future Enhancements
Integration with real medical APIs
AI-based diagnosis improvement
Multi-language support
Wearable device integration
Advanced analytics and predictions
👩‍💻 Author

Developed as part of a hackathon project focusing on practical healthcare assistance using modern web and mobile technologies.

🏁 Conclusion

MediVoice AI simplifies everyday healthcare interactions by combining intelligent chatbot capabilities with voice support, making healthcare guidance more accessible, interactive, and user-friendly.
