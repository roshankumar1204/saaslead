# SAASLEAD 🚀  
Automated Local Business Lead Discovery, Audit & Outreach System

SAASLEAD is a full-stack system that automatically discovers nearby businesses, audits their digital presence, classifies them into actionable leads, and enables **human-verified, AI-assisted email outreach**.

This project focuses on **quality outreach**, not spam.

---

## ✨ Features Implemented (Till Now)

### 🔍 Business Discovery
- Scan nearby businesses using OpenStreetMap (Overpass API)
- Store business name, category, address, latitude & longitude
- Avoid duplicate entries using geo-based uniqueness

### 🌐 Website Detection
- Detect whether a business has a website
- Store website source separately (discovery vs audit)

### 🧠 Website Audit
- Check:
  - Website reachability
  - Page title
  - Meta description
  - Mobile viewport
  - HTTPS usage
- Generate a **score** based on audit results
- Store full audit JSON for transparency

### ⭐ Lead Classification
- HOT / WARM / COLD classification based on audit score
- Designed for sales / outreach prioritization

### 📋 Approval Dashboard (React)
- View pending leads
- Filter leads (All / Hot / Warm)
- Clickable:
  - Website links
  - Google Maps links (address or lat/lon fallback)
- Inspect raw audit data

### ✉️ Intelligent Email Drafting
- Auto-generate **honest email drafts** based on:
  - Business category
  - Location
  - Real audit issues
- No fake personalization or assumptions

### 🤖 AI Email Polishing (Gemini)
- Uses Gemini **only to improve tone & clarity**
- Explicit rules:
  - No invented facts
  - No fake research claims
  - Only rephrasing & structuring

### ✅ Approve & Send Email
- One-click:
  - Approve lead
  - Generate email
  - (Optionally) polish with Gemini
  - Send email via SMTP
- No draft storage (simple v1 flow)

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- SQLite
- Nodemailer
- Google Gemini API
- OpenStreetMap (Overpass API)

### Frontend
- React (Vite)
- Plain CSS (no heavy UI framework)

---

## 📁 Project Structure

saaslead/
│── src/
│ ├── app.js
│ ├── config/
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ ├── utils/
│── ui/
│ └── approval-ui/
│── database.sqlite
│── .env
│── package.json


---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
⚠️ Use Gmail App Password, not your real password.

▶️ Running the Project
Backend
npm install
node src/app.js
Server runs on:

http://localhost:5000
Frontend
cd ui/approval-ui
npm install
npm run dev
Frontend runs on:

http://localhost:5173
🧪 Key API Endpoints
Method	Endpoint	Description
GET	/api/approvals/pending	Fetch pending leads
POST	/api/approvals/update	Approve / reject lead
POST	/api/approvals/approve-send	Approve & send email
GET	/api/email-draft/:id	Generate email draft
POST	/api/email-polish	Polish email with Gemini
🧠 Design Philosophy
Human-in-the-loop approval

No fake personalization

No spam automation

Claims based only on verifiable data

AI used as an assistant, not a liar

🚧 Planned Improvements
Email preview modal (instead of prompt)

Email history & follow-ups

Rate limiting & retry handling

Google Places integration (optional)

Role-based access

📜 Disclaimer
This project is currently a beta MVP.
Email sending and AI features are designed for controlled, ethical outreach and should not be used for spam.

🙌 Author
Built by Roshan Kumar
Focused on building practical, ethical automation systems.

⭐ If you find this project useful, feel free to star the repo!


