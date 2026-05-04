import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="appPage">
      <div className="container">
        <header className="topbar" style={{ marginBottom: 16 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h1>AI Interview Practice</h1>
            <div style={{ opacity: 0.92, fontSize: 13 }}>
              Voice-based mock interviews • Instant feedback • History & reports
            </div>
          </div>
          <div className="topbarActions">
            <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
            <Link className="btn btn-primary btn-sm" to="/signup">Sign up</Link>
          </div>
        </header>

        <div className="card" style={{ padding: 18 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 18,
              alignItems: 'center'
            }}
          >
            <div className="stack" style={{ gap: 14 }}>
              <div className="badge">New</div>
              <h2 className="title" style={{ fontSize: 38, lineHeight: 1.05, margin: 0 }}>
                Get interview-ready with an AI interviewer.
              </h2>
              <p className="muted" style={{ fontSize: 16, margin: 0, maxWidth: 640 }}>
                Choose a role, experience, and difficulty. Answer with your voice.
                Review transcripts, generate performance reports, and improve fast.
              </p>
              <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <Link className="btn btn-primary" to="/signup">Start free</Link>
                <Link className="btn btn-ghost" to="/login">I already have an account</Link>
              </div>
              <div className="muted" style={{ fontSize: 13 }}>
                Works best in Chrome for speech recognition.
              </div>
            </div>

            <div className="card-solid" style={{ padding: 16 }}>
              <div className="stack" style={{ gap: 12 }}>
                <div className="row" style={{ justifyContent: 'flex-start' }}>
                  <span className="pill pill-success">Real-time</span>
                  <span className="pill pill-warning">Voice</span>
                  <span className="pill">Reports</span>
                </div>
                <div className="stack" style={{ gap: 10 }}>
                  <div className="card-solid" style={{ padding: 12, background: 'rgba(255,255,255,0.65)' }}>
                    <div style={{ fontWeight: 850, marginBottom: 6 }}>Example question</div>
                    <div className="muted" style={{ fontSize: 14 }}>
                      “Explain the difference between REST and WebSockets, and when you’d use each.”
                    </div>
                  </div>
                  <div className="card-solid" style={{ padding: 12, background: 'rgba(255,255,255,0.65)' }}>
                    <div style={{ fontWeight: 850, marginBottom: 6 }}>What you get</div>
                    <div className="muted" style={{ fontSize: 14 }}>
                      Score breakdown, strengths, improvements, and personalized recommendations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 16 }}>
          <div className="card-solid panel hoverLift">
            <div className="badge">Guided setup</div>
            <h3 className="sectionTitle" style={{ margin: '10px 0 6px' }}>Tailored sessions</h3>
            <div className="muted">
              Pick position, experience, and difficulty to match the job you’re targeting.
            </div>
          </div>

          <div className="card-solid panel hoverLift">
            <div className="badge">Speak & respond</div>
            <h3 className="sectionTitle" style={{ margin: '10px 0 6px' }}>Voice-first practice</h3>
            <div className="muted">
              Practice answering out loud and build real interview confidence.
            </div>
          </div>

          <div className="card-solid panel hoverLift">
            <div className="badge">History</div>
            <h3 className="sectionTitle" style={{ margin: '10px 0 6px' }}>Track progress</h3>
            <div className="muted">
              Review transcripts and generate reports to see improvements over time.
            </div>
          </div>

          <div className="card-solid panel hoverLift">
            <div className="badge">Actionable feedback</div>
            <h3 className="sectionTitle" style={{ margin: '10px 0 6px' }}>Know what to fix</h3>
            <div className="muted">
              Get strengths, weaknesses, and recommendations you can apply immediately.
            </div>
          </div>
        </div>

        <footer className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 13 }}>
          Built for focused practice — start a new interview anytime.
        </footer>
      </div>
    </div>
  );
}

export default Landing;
