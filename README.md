# 🏛️ AI-Based Local Government Feedback & Escalation System

A smart civic complaint management system where citizens can raise issues, AI classifies and routes them to the correct department, and government staff can track, resolve, and escalate issues with automation.

---

## 🚀 Features

### 👤 Citizen Side
- Submit text-based complaints.
- AI classifies complaint priority: `High`, `Medium`, `Low`.
- Track complaint status: `Pending`, `Assigned`, `Resolved`, `Escalated`, etc.
- Confirm resolution to help close the complaint.

### 🧑‍💼 Government Staff Side
- View and filter complaints by priority.
- Click on complaints to get AI-suggested contact/email of relevant department.
- Mark complaints as assigned or resolved.
- Automatic escalation if issue isn’t resolved in a timely manner.
- Auto-removal if user doesn't confirm resolution within time.

### 🧠 AI/LLM Features
- **Priority Classification** of complaints using Gemini/OpenAI APIs.
- **Department Mapping** based on complaint text using prompt-engineered LLM calls.
- **Auto-Escalation Engine** with background job based on priority.

---

## 🧱 Tech Stack

- **Frontend**: React, TailwindCSS, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI API**: Google Gemini or OpenAI (via prompt engineering)
- **Charts**: Chart.js or Recharts (optional for analytics)

---

## 📂 Folder Structure

```
project-root/
├── backend/               # Node.js + Express API
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # LLM classification, escalation logic
│   └── server.js
├── frontend/              # React frontend app
│   ├── src/
│   │   ├── user/          # Citizen dashboard
│   │   ├── staff/         # Staff dashboard
│   │   ├── api/           # Axios instance
│   │   └── App.jsx
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-municipal-feedback.git
cd ai-municipal-feedback
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

#### 🔑 Add Environment Variables in `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/municipal-complaints
GEMINI_API_KEY=your_gemini_api_key
```

#### ▶️ Start Backend Server

```bash
npm start
```

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

#### ▶️ Start React App

```bash
npm run dev      # if using Vite
# OR
npm start        # if using Create React App
```

---

## 🌐 Application URLs

- **User Dashboard**: `http://localhost:3000/`
- **Staff Dashboard**: `http://localhost:3000/staff`

---

## 🧪 API Overview

| Endpoint                        | Method | Description                          |
|---------------------------------|--------|--------------------------------------|
| `/api/complaints`              | POST   | Submit a new complaint               |
| `/api/complaints/user`         | GET    | Get complaints for current user      |
| `/api/complaints`              | GET    | Get all complaints (staff view)      |
| `/api/complaints/:id/assign`   | PUT    | Assign and auto-tag department       |
| `/api/complaints/:id/resolve`  | PUT    | Mark as resolved                     |
| `/api/complaints/:id/confirm`  | PUT    | User confirms resolution             |

---

## ⏱️ Auto-Escalation Logic

- **High Priority** → escalate after 1 day
- **Medium Priority** → escalate after 3 days
- **Low Priority** → escalate after 5 days
- **Resolved but not confirmed** → auto-remove after 3 days

Runs via a CRON job or backend scheduler.

---

## 📊 Future Enhancements

- Admin analytics dashboard with charts
- Notification system (email/SMS)
- Location tagging via Google Maps

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

