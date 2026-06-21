import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AppLayout from '../components/AppLayout';
import { SkeletonHistory } from '../components/Skeleton';

function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    fetchInterviews(userData.id);
  }, [navigate]);

  const fetchInterviews = async (userId) => {
    try {
      const response = await api.get(`/interviews/user/${userId}`);
      setInterviews(response.data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <SkeletonHistory />;

  const completed = interviews.filter(i => !i.isStart).length;
  const inProgress = interviews.filter(i => i.isStart).length;

  return (
    <AppLayout
      title="Interview History"
      subtitle="Review past sessions and generate reports"
      actions={
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      }
    >
      <section className="card mb-4">
        <h2 className="text-heading mb-4">Your Statistics</h2>
        <div className="grid-3">
          <div className="stat-card">
            <div className="stat-value">{interviews.length}</div>
            <div className="stat-label">Total Interviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
      </section>

      <h2 className="text-heading mb-4">Your Interviews</h2>

      {interviews.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon" aria-hidden="true">📋</div>
          <p className="text-body text-muted mb-4">
            No interviews yet. Start your first interview from the dashboard!
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="interview-list">
          {interviews.map((interview) => (
            <article key={interview._id} className="card card-hover">
              <div className="interview-card-header">
                <div>
                  <h3 className="interview-position">{interview.position}</h3>
                  <p className="interview-date">{formatDate(interview.createdAt)}</p>
                </div>
                <span className={`pill ${interview.isStart ? 'pill-warning' : 'pill-success'}`}>
                  {interview.isStart ? 'In Progress' : 'Completed'}
                </span>
              </div>

              <div className="stack stack-sm">
                <div className="detail-row">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{interview.experience}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Difficulty</span>
                  <span className="detail-value">{interview.difficulty}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Messages</span>
                  <span className="detail-value">
                    {interview.chatTranscript.length} exchanges
                  </span>
                </div>
              </div>

              <div className="card-footer row justify-start gap-sm">
                {!interview.isStart && interview.chatTranscript.length > 0 && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => navigate(`/report/${interview._id}`)}
                  >
                    Generate Report
                  </button>
                )}
                {interview.isStart && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/interview/${interview._id}`)}
                  >
                    Continue Interview
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

export default InterviewHistory;
