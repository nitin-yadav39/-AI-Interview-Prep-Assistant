import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interviewData, setInterviewData] = useState({
    position: '',
    experience: '',
    difficulty: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewData({ ...interviewData, [name]: value });
  };

  const handleStartInterview = async () => {
    // Validate that all fields are filled
    if (!interviewData.position || !interviewData.experience || !interviewData.difficulty) {
      alert('Please fill in all fields before starting the interview');
      return;
    }

    try {
      const response = await api.post('/interview/start', {
        userId: user.id,
        ...interviewData
      });
      navigate(`/interview/${response.data.interviewId}`);
    } catch (error) {
      alert('Error starting interview');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="page muted">Loading...</div>;

  return (
    <div className="appPage">
      <div className="container">
        <header className="topbar">
          <div className="stack" style={{ gap: 4 }}>
            <h1>AI Interview Practice Tool</h1>
            <div style={{ opacity: 0.92, fontSize: 13 }}>
              Welcome, <strong>{user.firstName} {user.lastName}</strong>
            </div>
          </div>
          <div className="topbarActions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>
              View History
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="grid2">
          <section className="card-solid panel">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="stack" style={{ gap: 6 }}>
                <div className="badge">Interview setup</div>
                <div className="muted" style={{ fontSize: 14 }}>
                  Choose role, experience, and difficulty.
                </div>
              </div>
              <div style={{ fontSize: 34, lineHeight: 1 }}>🎙️</div>
            </div>

            <div className="divider" style={{ margin: '14px 0' }} />

            <div className="stack">
              <div>
                <label className="label" htmlFor="position">Position</label>
                <input
                  id="position"
                  type="text"
                  name="position"
                  placeholder="e.g., Software Intern, Data Analyst"
                  className="field"
                  value={interviewData.position}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="label" htmlFor="experience">Experience level</label>
                <select
                  id="experience"
                  name="experience"
                  className="field select"
                  value={interviewData.experience}
                  onChange={handleInputChange}
                >
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="field select"
                  value={interviewData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <button className="btn btn-success btn-wide" onClick={handleStartInterview}>
                Start Interview
              </button>
            </div>
          </section>

          <section className="card-solid panel">
            <div className="stack" style={{ gap: 6 }}>
              <div className="badge">How it works</div>
              <div className="muted" style={{ fontSize: 14 }}>
                A quick overview of the flow.
              </div>
            </div>

            <div className="divider" style={{ margin: '14px 0' }} />

            <ol className="stack" style={{ gap: 12, paddingLeft: 18, margin: 0 }}>
              <li>Fill in your interview details</li>
              <li>Click “Start Interview” to begin</li>
              <li>Allow microphone access when prompted</li>
              <li>Click the mic button and speak your answer</li>
              <li>AI will ask questions and respond via voice</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;