# MediVoice AI Web Frontend

React web frontend for the `MediVoice AI` hackathon project. This app connects to the Flask backend using the exact `/api` contract and is designed for demo-friendly desktop and laptop use.

## Stack

- React.js
- Vite
- Axios
- React Router
- Recharts

## Folder Structure

```text
web/
  src/
    components/
    pages/
    services/
    hooks/
    utils/
    assets/
    context/
    App.js
    main.jsx
  package.json
  .env.example
  README.md
```

## Local Setup

1. Open a terminal in `/Users/imrikrupa/Documents/New project/web`
2. Install dependencies:

```bash
npm install
```

3. Create your local environment file:

```bash
cp .env.example .env
```

4. Make sure the backend is running on:

```text
http://localhost:5000
```

5. Start the frontend:

```bash
npm run dev
```

6. Open the local Vite URL shown in the terminal.

## Backend Contract Notes

- Base URL must come from `VITE_API_BASE_URL`
- Default local API should be `http://localhost:5000/api`
- All protected requests send `Authorization: Bearer <token>`
- All API calls expect the backend response contract:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "error": null
}
```

## Pages Included

- Landing page
- Login/Register page
- Chatbot page
- Patient dashboard page
- Appointments page
- Medication tracker page
- Insights page
- History page

## Demo Notes

- Login with seeded backend accounts if available:
  - `aarav@example.com`
  - `neha@example.com`
  - `rohit@example.com`
- Default seed password from the backend README:
  - `Password123`
