import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AppLayout from '../components/AppLayout';
import { SkeletonReport } from '../components/Skeleton';

function getScoreColor(score) {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-error)';
}

function getPerformanceColor(level) {
  const colors = {
    'Excellent': 'var(--color-success)',
    'Good': '#34d399',
    'Average': 'var(--color-warning)',
    'Needs Improvement': 'var(--color-error)'
  };
  return colors[level] || 'var(--color-text-muted)';
}

function Report() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateReport();
  }, [interviewId]);

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/interview/report/${interviewId}`);
      setReport(response.data.report);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonReport />;

  if (error || !report) {
    return (
      <div className="page-center page-enter">
        <div className="card text-center" style={{ maxWidth: 420, padding: 32 }}>
          <h2 className="text-heading mb-2">{error ? 'Error' : 'No Report Available'}</h2>
          {error && <p className="text-caption text-muted mb-4">{error}</p>}
          <button className="btn btn-primary" onClick={() => navigate('/history')}>
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 80;

  return (
    <AppLayout
      title="Performance Report"
      subtitle={`${report.position} · ${new Date(report.interviewDate).toLocaleDateString()}`}
      actions={
        <button className="btn btn-secondary btn-sm no-print" onClick={() => navigate('/history')}>
          Back to History
        </button>
      }
    >
      <div className="report-content">
        {/* Interview Details */}
        <section className="card">
          <h2 className="text-heading mb-4">Interview Details</h2>
          <div className="info-grid">
            <div>
              <div className="info-item-label">Position</div>
              <div className="info-item-value">{report.position}</div>
            </div>
            <div>
              <div className="info-item-label">Experience</div>
              <div className="info-item-value">{report.experience}</div>
            </div>
            <div>
              <div className="info-item-label">Difficulty</div>
              <div className="info-item-value">{report.difficulty}</div>
            </div>
            <div>
              <div className="info-item-label">Date</div>
              <div className="info-item-value">
                {new Date(report.interviewDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </section>

        {/* Overall Score */}
        <section className="card text-center">
          <h2 className="text-heading mb-4">Overall Performance</h2>
          <div className="score-ring-wrap">
            <svg width="180" height="180" viewBox="0 0 200 200" aria-hidden="true">
              <circle
                cx="100" cy="100" r="80"
                fill="none"
                stroke="var(--color-bg-muted)"
                strokeWidth="16"
              />
              <circle
                cx="100" cy="100" r="80"
                fill="none"
                stroke={getScoreColor(report.overallScore)}
                strokeWidth="16"
                strokeDasharray={`${(report.overallScore / 100) * circumference} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dasharray 600ms ease' }}
              />
            </svg>
            <div className="score-ring-text">
              <div className="score-number">{report.overallScore}</div>
              <div className="score-denom">/ 100</div>
            </div>
          </div>
          <div className="mt-4">
            <span
              className="performance-badge"
              style={{ backgroundColor: getPerformanceColor(report.performanceLevel) }}
            >
              {report.performanceLevel}
            </span>
          </div>
        </section>

        {/* Score Breakdown */}
        <section className="card">
          <h2 className="text-heading mb-4">Score Breakdown</h2>
          <div className="stack">
            {[
              { label: 'Technical Skills', score: report.technicalScore },
              { label: 'Communication', score: report.communicationScore },
              { label: 'Confidence', score: report.confidenceScore },
              { label: 'Problem Solving', score: report.problemSolvingScore }
            ].map((item) => (
              <div key={item.label}>
                <div className="score-row">
                  <span className="text-label">{item.label}</span>
                  <span className="text-label" style={{ color: getScoreColor(item.score), fontWeight: 500 }}>
                    {item.score}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: getScoreColor(item.score)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths & Weaknesses */}
        <div className="grid-2">
          <section className="card">
            <h2 className="text-heading mb-4">Strengths</h2>
            <ul className="list-clean">
              {report.strengths.map((strength, index) => (
                <li key={index} className="list-item">
                  <span className="list-icon-success" aria-hidden="true">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-heading mb-4">Areas for Improvement</h2>
            <ul className="list-clean">
              {report.weaknesses.map((weakness, index) => (
                <li key={index} className="list-item">
                  <span className="list-icon-warning" aria-hidden="true">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Detailed Feedback */}
        <section className="card">
          <h2 className="text-heading mb-4">Detailed Feedback</h2>
          <p className="text-label" style={{ lineHeight: 'var(--leading)' }}>
            {report.detailedFeedback}
          </p>
        </section>

        {/* Recommendations */}
        <section className="card">
          <h2 className="text-heading mb-4">Recommendations</h2>
          <div className="stack">
            {report.recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-num">{index + 1}</div>
                <p className="text-label">{recommendation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="card">
          <h2 className="text-heading mb-4">Interview Statistics</h2>
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-value">{report.questionsAsked}</div>
              <div className="stat-label">Questions Asked</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{report.answersGiven}</div>
              <div className="stat-label">Answers Given</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{report.averageResponseLength}</div>
              <div className="stat-label">Avg Response</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{report.interviewDuration}</div>
              <div className="stat-label">Duration</div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="row justify-start gap-sm no-print">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print Report
          </button>
          <button className="btn btn-success" onClick={() => navigate('/dashboard')}>
            Start New Interview
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default Report;
