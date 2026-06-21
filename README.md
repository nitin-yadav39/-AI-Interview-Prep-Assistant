# AI Interview Prep Assistant

A full-stack application for practicing job interviews with AI using voice interaction. Built with React, Node.js, Express, Supabase (PostgreSQL), Socket.IO, and OpenRouter AI.

![AI Interview Practice](https://img.shields.io/badge/AI-Interview-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-blue)

## 🎯 Features

- **Voice-Based Interviews**: Speak your answers and hear AI responses
- **Real-time Communication**: Socket.IO for instant AI responses
- **AI-Powered Questions**: OpenRouter AI generates contextual interview questions
- **User Authentication**: Signup/Login system
- **Interview Customization**: Choose position, experience level, and difficulty
- **Chat Transcript**: All interviews are saved to database

## 🛠️ Tech Stack

### Frontend
- React 18.2 + Vite
- React Router DOM
- Axios
- Socket.IO Client
- Web Speech API (for voice recognition)

### Backend
- Node.js + Express
- Supabase (PostgreSQL) + `@supabase/supabase-js`
- Socket.IO
- OpenRouter AI
- CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/

2. **Supabase Account**
   - Create a free project: https://supabase.com/
   - Go to **Project Settings > API** to find your **Project URL** and **`service_role` secret API key** (do not use the public `anon` key, as the backend needs admin bypass permissions).

3. **OpenRouter API Key**
   - Get your API key: https://openrouter.ai/
   - Click "Create API Key"

4. **Code Editor** (Recommended)
   - VS Code: https://code.visualstudio.com/

## 🚀 Installation & Setup

### Step 1: Extract the ZIP file
```bash
# Extract ai-interview-app.zip to your desired location
# Navigate to the extracted folder
cd ai-interview-app
```

### Step 2: Setup Database Tables (Supabase)

Before running the backend, create the required tables in your Supabase workspace:

1. Go to your **Supabase Workspace > SQL Editor**.
2. Click **New Query**.
3. Copy, paste, and run the following SQL script:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  is_start BOOLEAN NOT NULL DEFAULT false,
  chat_transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create automated trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE
  ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE
  ON public.interviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

### Step 3: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file and add your credentials:
# - Replace the SUPABASE_URL and SUPABASE_KEY placeholders with your actual Supabase URL & service_role key
# - Replace the OpenRouter placeholder key with your actual key
```

**Example `.env` configuration:**
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-service-role-key

OPENROUTER_API_KEY=sk-or-your_actual_key_here
JWT_SECRET=ai_interviewer_super_secret_key
```

### Step 4: Setup Frontend

```bash
# Open a new terminal
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

### Step 5: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🔌 Supabase initialized
🚀 Server running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 6: Access the Application

Open your browser and go to: **http://localhost:5173/**

## 📱 How to Use

1. **Sign Up**: Create a new account with your details
2. **Login**: Sign in with your credentials
3. **Dashboard**: Review interview settings (Position, Experience, Difficulty)
4. **Start Interview**: Click "Start Interview" button
5. **Allow Microphone**: Grant microphone permissions when prompted
6. **Speak**: Click the microphone button and speak your answer
7. **Listen**: AI will respond with questions via voice and text
8. **Stop**: Click "Stop Interview" when finished

## 🎤 Voice Recognition Tips

- **Best Browser**: Use Google Chrome for best voice recognition
- **Microphone**: Ensure your microphone is working properly
- **Permissions**: Allow microphone access when prompted
- **Speaking**: Speak clearly and wait for recording to stop before speaking
- **Internet**: Stable internet connection required for speech recognition

## 📁 Project Structure

```
ai-interview-app/
├── backend/
│   ├── supabaseClient.js     # Supabase initialization & mapping helper
│   ├── server.js             # Main server file (Express & Socket.IO APIs)
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── Signup.jsx    # Signup page
│   │   │   ├── Dashboard.jsx # Dashboard page
│   │   │   └── Interview.jsx # Interview page
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Login user
- `GET /api/user/:userId` - Get user details

### Interview
- `POST /api/interview/start` - Start new interview
- `POST /api/interview/stop/:interviewId` - Stop interview
- `GET /api/interviews/user/:userId` - Get interview history of a user
- `POST /api/interview/report/:interviewId` - Generate interview report

### Socket.IO Events
- `join-interview` - Join interview room
- `user-message` - Send user message to AI
- `ai-response` - Receive AI response

## 🐛 Troubleshooting

### Issue: Port Already in Use
**Solution**: Change the PORT in `backend/.env` to 5001 or any available port

### Issue: Supabase Query/Connection Error
**Solution**: 
- Double-check that your `SUPABASE_URL` and `SUPABASE_KEY` (use `service_role` key) are correctly populated in `backend/.env`.
- Verify you have run the SQL script to create the `users` and `interviews` tables in your Supabase workspace SQL Editor.
- Ensure the table names match (`users` and `interviews`).

### Issue: Voice Recognition Not Working
**Solution**:
- Use Google Chrome browser
- Check microphone permissions in browser settings
- Ensure you're using HTTPS or localhost

### Issue: OpenRouter API Error
**Solution**:
- Verify your OpenRouter API key is correct in `.env`
- Check API key has proper permissions
- Ensure you haven't exceeded rate limits

### Issue: CORS Errors
**Solution**:
- Ensure backend server is running
- Verify CORS settings in `server.js`

## 🔐 Security Notes

⚠️ **Important**: This is a beginner-friendly demo application. For production use, you should:

- Hash passwords using bcrypt (stored plain text for demo compatibility)
- Implement rate limiting
- Add input validation and sanitization
- Use environment-specific configurations
- Add HTTPS in production

## 🤝 Contributing

This is an educational project. Feel free to fork and modify for your learning!

## 📄 License

MIT License - Feel free to use this project for learning purposes.

## 👨‍💻 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed correctly
3. Verify environment variables are set properly
4. Check that all terminals show no errors

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/)
- [OpenRouter API](https://openrouter.ai/)

---

**Built with ❤️ for Interview Practice**
Happy Interviewing! 🚀
