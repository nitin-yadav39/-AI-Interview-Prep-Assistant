const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

if (!OPENROUTER_API_KEY ||
    OPENROUTER_API_KEY === '' ||
    !OPENROUTER_API_KEY.startsWith('sk-or-')) {
  console.error('❌ Invalid or missing OPENROUTER_API_KEY.');
  console.error('   Set OPENROUTER_API_KEY in backend/.env to a valid OpenRouter key (sk-or-...).');
  process.exit(1);
}

async function generateOpenRouterResponse({ messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1000 }) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: 'Bearer ' + OPENROUTER_API_KEY,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const textBody = await response.text();

  if (!response.ok) {
    let errorDetails = textBody;
    try {
      const json = JSON.parse(textBody);
      errorDetails = json?.error?.message || json?.detail || JSON.stringify(json);
    } catch (_) {}
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} ${errorDetails}`);
  }

  if (contentType.includes('text/html')) {
    throw new Error(`OpenRouter API returned HTML instead of JSON. Check the endpoint URL and key. Response snippet: ${textBody.slice(0, 300)}`);
  }

  const json = JSON.parse(textBody);
  const choice = json?.choices?.[0];
  let text = choice?.message?.content || choice?.text || json?.output_text || '';
  if (typeof text === 'object') {
    text = JSON.stringify(text);
  }

  return String(text).trim();
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const Interview = require('./models/Interview');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

// ============= REST APIs =============

// 1. Signup API
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'ai_interviewer_super_secret_key', { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: user._id,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'ai_interviewer_super_secret_key', { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. Get User Details API
app.get('/api/user/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 4. Start Interview API
app.post('/api/interview/start', auth, async (req, res) => {
  try {
    const { userId, position, experience, difficulty } = req.body;
    
    const interview = new Interview({
      userId,
      position,
      experience,
      difficulty,
      isStart: true,
      chatTranscript: []
    });
    
    await interview.save();
    
    res.status(201).json({ 
      message: 'Interview started',
      interviewId: interview._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 5. Stop Interview API
app.post('/api/interview/stop/:interviewId', auth, async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.interviewId,
      { isStart: false },
      { new: true }
    );
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json({ 
      message: 'Interview stopped',
      interview 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 6. Get User Interviews API
app.get('/api/interviews/user/:userId', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json({ 
      message: 'Interviews retrieved successfully',
      count: interviews.length,
      interviews 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 7. Generate Interview Report API
app.post('/api/interview/report/:interviewId', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Analyze the interview using OpenRouter
    const transcript = interview.chatTranscript
      .map(chat => `${chat.role.toUpperCase()}: ${chat.message}`)
      .join('\n\n');

    const prompt = `You are an expert interview analyst. Analyze the following job interview transcript and provide a detailed performance report.

Interview Details:
- Position: ${interview.position}
- Experience Level: ${interview.experience}
- Difficulty: ${interview.difficulty}

Transcript:
${transcript}

Provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "overallScore": <number between 0-100>,
  "strengths": [<array of 3-5 key strengths>],
  "weaknesses": [<array of 3-5 areas for improvement>],
  "technicalScore": <number between 0-100>,
  "communicationScore": <number between 0-100>,
  "confidenceScore": <number between 0-100>,
  "problemSolvingScore": <number between 0-100>,
  "detailedFeedback": "<comprehensive feedback paragraph>",
  "recommendations": [<array of 3-5 specific recommendations>],
  "questionsAsked": <number of questions asked by interviewer>,
  "answersGiven": <number of answers given by candidate>,
  "averageResponseLength": "<short/medium/long>",
  "interviewDuration": "<estimated duration based on conversation>",
  "performanceLevel": "<Excellent/Good/Average/Needs Improvement>"
}`;

    const aiResponse = await generateOpenRouterResponse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview analyst. Provide only valid JSON output with no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        }
      ],
      temperature: 0.5,
      max_tokens: 900
    });
    
    // Parse the JSON response
    let reportData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      reportData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      // If parsing fails, return a default structure
      reportData = {
        overallScore: 70,
        strengths: ["Completed the interview", "Responded to questions", "Showed engagement"],
        weaknesses: ["Could provide more detailed responses"],
        technicalScore: 70,
        communicationScore: 70,
        confidenceScore: 70,
        problemSolvingScore: 70,
        detailedFeedback: "The interview was conducted successfully. Continue practicing to improve your skills.",
        recommendations: ["Practice more technical questions", "Improve response clarity", "Research the company thoroughly"],
        questionsAsked: interview.chatTranscript.filter(c => c.role === 'ai').length,
        answersGiven: interview.chatTranscript.filter(c => c.role === 'user').length,
        averageResponseLength: "medium",
        interviewDuration: "15-20 minutes",
        performanceLevel: "Good"
      };
    }
    
    // Add interview details to the report
    const fullReport = {
      interviewId: interview._id,
      position: interview.position,
      experience: interview.experience,
      difficulty: interview.difficulty,
      interviewDate: interview.createdAt,
      ...reportData
    };
    
    res.json({ 
      message: 'Report generated successfully',
      report: fullReport
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// ============= Socket.IO for Real-time Interview =============

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  // Join interview room
  socket.on('join-interview', async (data) => {
    const { interviewId } = data;
    socket.join(interviewId);
    console.log(`User joined interview: ${interviewId}`);
    
    // Send initial greeting
    const interview = await Interview.findById(interviewId);
    const greeting = `Hello! I'm your AI interviewer. You're interviewing for the ${interview.position} position. Let me introduce myself and we'll begin with some questions. Are you ready?`;
    
    socket.emit('ai-response', { message: greeting });
  });
  
  // Handle user's voice/text message
  socket.on('user-message', async (data) => {
    try {
      const { interviewId, message } = data;
      
      // Save user message to database
      await Interview.findByIdAndUpdate(interviewId, {
        $push: {
          chatTranscript: {
            role: 'user',
            message: message,
            timestamp: new Date()
          }
        }
      });
      
      // Get interview context
      const interview = await Interview.findById(interviewId);
      
      // Generate AI response using OpenRouter
      const prompt = `You are an AI interviewer conducting a ${interview.difficulty} level interview for a ${interview.position} position for someone with ${interview.experience} experience.
      
User said: "${message}"

Respond professionally as an interviewer. Ask relevant technical or behavioral questions based on the position. Keep responses concise and conversational.`;
      
      const aiResponse = await generateOpenRouterResponse({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI interviewer. Ask follow-up questions, keep the tone professional, and stay concise.',
          },
          {
            role: 'user',
            content: prompt,
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      // Save AI response to database
      await Interview.findByIdAndUpdate(interviewId, {
        $push: {
          chatTranscript: {
            role: 'ai',
            message: aiResponse,
            timestamp: new Date()
          }
        }
      });
      
      // Send AI response back to user
      socket.emit('ai-response', { message: aiResponse });
      
    } catch (error) {
      console.error('AI response error:', error);
      socket.emit('ai-error', { message: error?.message || 'AI service unavailable. Please try again.' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Serve static assets in production (if built frontend exists)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});