import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api';
import ThemeToggle from '../components/ThemeToggle';

function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join-interview', { interviewId });

    socketRef.current.on('ai-response', (data) => {
      setMessages(prev => [...prev, { role: 'ai', text: data.message }]);
      speakText(data.message);
    });

    socketRef.current.on('ai-error', (data) => {
      setMessages(prev => [...prev, { role: 'ai', text: data.message }]);
    });

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessages(prev => [...prev, { role: 'user', text: transcript }]);
        socketRef.current.emit('user-message', { interviewId, message: transcript });
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsRecording(false);
        if (event.error !== 'no-speech') alert('Speech recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }

    return () => {
      socketRef.current?.disconnect();
      window.speechSynthesis?.cancel();
    };
  }, [interviewId]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) return alert('Speech recognition only works in Chrome');
    setIsRecording(true);
    try { recognitionRef.current.start(); } catch { setIsRecording(false); }
  };

  const handleStopInterview = async () => {
    try {
      await api.post(`/interview/stop/${interviewId}`);
      window.speechSynthesis?.cancel();
      navigate('/dashboard');
    } catch {
      alert('Error stopping interview');
    }
  };

  return (
    <div className="interview-page page-enter">
      <header className="interview-header">
        <div className="stack stack-sm">
          <span className="text-heading">Interview in Progress</span>
          <span className="text-caption text-muted">Speak clearly and take your time</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-danger btn-sm" onClick={handleStopInterview}>
            End Interview
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="interview-avatar-section">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="AI Interviewer"
          className="interview-avatar"
        />
        <h2 className="text-heading mt-2">Your AI Interviewer</h2>
        <p className="text-caption text-muted">
          I will ask questions and guide your interview.
        </p>
      </div>

      <div className="chat-shell">
        <div className="chat-scroll">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="skeleton skeleton-circle" style={{ width: 48, height: 48 }} />
              <p className="text-body text-muted">Waiting for the AI interviewer to begin…</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}
            >
              <div className="bubble-meta">
                {msg.role === 'user' ? 'You' : 'AI Interviewer'}
              </div>
              <div className="bubble-text">{msg.text}</div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-controls text-center">
          <p className="text-caption text-muted mb-2">
            {isRecording ? 'Listening… speak now!' : 'Press the button and answer the question'}
          </p>
          <button
            className={`btn btn-success record-btn${isRecording ? ' recording' : ''}`}
            onClick={startRecording}
            disabled={isRecording}
          >
            {isRecording ? 'Recording…' : 'Start Speaking'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interview;
