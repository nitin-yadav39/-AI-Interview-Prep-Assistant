import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppLayout from '../components/AppLayout';
import { SkeletonDashboard } from '../components/Skeleton';

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
    } catch {
      alert('Error starting interview');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <SkeletonDashboard />;

  return (
    <AppLayout
      title="AI Interview Practice"
      subtitle={`Welcome, ${user.firstName} ${user.lastName}`}
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>
            View History
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </>
      }
    >
      <div className="grid-2">
        <section className="card">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div className="stack stack-sm">
              <span className="badge">Interview setup</span>
              <p className="text-caption text-muted">
                Choose role, experience, and difficulty.
              </p>
            </div>
            <span style={{ fontSize: 28 }} aria-hidden="true">🎙️</span>
          </div>

          <div className="divider" />

          <div className="stack">
            <div className="field-group">
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

            <div className="field-group">
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

            <div className="field-group">
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

            <button className="btn btn-success btn-wide btn-lg" onClick={handleStartInterview}>
              Start Interview
            </button>
          </div>
        </section>

        <section className="card">
          <div className="stack stack-sm">
            <span className="badge">How it works</span>
            <p className="text-caption text-muted">A quick overview of the flow.</p>
          </div>

          <div className="divider" />

          <ol className="stack" style={{ paddingLeft: 20, margin: 0 }}>
            <li className="text-label">Fill in your interview details</li>
            <li className="text-label">Click &ldquo;Start Interview&rdquo; to begin</li>
            <li className="text-label">Allow microphone access when prompted</li>
            <li className="text-label">Click the mic button and speak your answer</li>
            <li className="text-label">AI will ask questions and respond via voice</li>
          </ol>
        </section>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
