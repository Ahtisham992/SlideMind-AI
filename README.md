# 🧠 SlideMind AI
### Transform Lecture Slides into Structured Knowledge

SlideMind AI is a professional, AI-powered smart learning platform designed to help students and professionals convert static lecture slides (PDF/PPTX) into dynamic, interactive learning experiences. By leveraging the power of Gemini AI, it extracts core concepts, generates executive summaries, and crafts custom practice exams to supercharge your study sessions.

---

## ✨ Key Features

- **📂 Multi-Format Support**: Seamlessly upload and process both PDF and PowerPoint (PPTX) lecture materials.
- **📝 Intelligent Summarization**: Get instant executive summaries and bulleted key points to grasp complex topics in seconds.
- **🧩 Structured Knowledge Flow**: Automatically extracts distinct topics and concepts, allowing for organized "deep-dive" learning.
- **🤖 AI Chat Tutor**: A contextual assistant that has "read" your slides and is ready to answer specific questions 24/7.
- **📝 Smart Quizzes**: Generate AI-powered practice exams with configurable difficulty (Easy, Medium, Hard) and question counts.
- **🎨 Premium Light UI**: A high-definition, professional light theme designed for focus and clarity, featuring smooth Framer Motion animations.
- **🚀 Real-time Processing**: Fast, efficient document parsing and AI analysis with visual progress tracking.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks + Session Storage

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
- **Document Parsing**: `python-pptx`, `PyPDF2`, `pdfminer.six`
- **Environment**: `python-dotenv`, `uvicorn`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key

### 2. Environment Setup

#### Backend (`/backend/.env`)
Create a `.env` file in the backend directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Installation & Running

#### 🐍 Backend (Python)
```powershell
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
*Backend runs at `http://localhost:8000`*

#### ⚛️ Frontend (Next.js)
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`*

---

## 🐳 Docker Deployment

The project is containerized for easy deployment. Run the entire stack with a single command:

```bash
docker-compose up --build
```

---

## 🎨 Branding & Design
SlideMind AI features a custom-designed branding system:
- **Logo**: A transparent, minimalist icon merging a slide document with a neural brain pattern.
- **Theme**: A professional Light Theme (Slate/White/Brand Blue) optimized for prolonged study sessions.
- **UX**: High-definition interactions with pulsating branded loading states and glassmorphism elements.

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ for the future of learning.
