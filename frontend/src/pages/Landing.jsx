import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import '../landing.css';

/* ── Outline icons (consistent stroke style) ── */
const IconMic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>
);

const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconBrain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconChevron = () => (
  <svg className="lp-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

const FEATURES = [
  { icon: IconMic, title: 'Voice-first interviews', desc: 'Practice speaking your answers out loud — just like a real interview. Our AI listens, responds, and adapts in real time.' },
  { icon: IconBrain, title: 'AI-powered questions', desc: 'Get contextual follow-up questions tailored to your role, experience level, and chosen difficulty — no two sessions are the same.' },
  { icon: IconChart, title: 'Performance reports', desc: 'Receive detailed score breakdowns across technical skills, communication, confidence, and problem-solving after every session.' },
  { icon: IconTarget, title: 'Role-specific prep', desc: 'Configure position, seniority, and difficulty to mirror the exact job you\'re targeting — from intern to senior engineer.' },
  { icon: IconClock, title: 'Practice anytime', desc: 'No scheduling needed. Start a mock interview in under 60 seconds and practice as often as you want, on your schedule.' },
  { icon: IconShield, title: 'Private & secure', desc: 'Your sessions and transcripts are stored securely. Practice freely without worrying about your data being shared.' },
];

const TESTIMONIALS = [
  { initials: 'SK', name: 'Sarah Kim', role: 'Software Engineer', company: 'Stripe', quote: 'I went from freezing up on behavioral questions to confidently articulating my experience. Landed my dream role after two weeks of daily practice.' },
  { initials: 'MR', name: 'Marcus Rivera', role: 'Product Manager', company: 'Notion', quote: 'The AI follow-ups are surprisingly realistic. It caught gaps in my answers that no YouTube video ever would. Worth every minute.' },
  { initials: 'AP', name: 'Aisha Patel', role: 'Data Analyst', company: 'Deloitte', quote: 'As a career switcher, I had no idea what to expect in interviews. The performance reports showed me exactly where to improve. Game changer.' },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    popular: false,
    features: ['3 mock interviews per month', 'Basic AI questions', 'Session transcripts', 'Email support'],
    cta: 'Get started free',
    variant: 'secondary',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    popular: true,
    features: ['Unlimited mock interviews', 'Advanced AI with follow-ups', 'Full performance reports', 'Interview history & analytics', 'Priority support'],
    cta: 'Start 7-day free trial',
    variant: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    popular: false,
    features: ['Everything in Pro', 'Team dashboards & admin', 'Custom question banks', 'SSO & compliance', 'Dedicated success manager'],
    cta: 'Contact sales',
    variant: 'secondary',
  },
];

const FAQS = [
  { q: 'How realistic are the AI interview questions?', a: 'Our AI generates contextual questions based on your chosen role, experience level, and difficulty. It asks intelligent follow-ups based on your answers — mimicking how a real interviewer probes deeper into your responses.' },
  { q: 'Do I need special software or equipment?', a: 'Just a modern browser (Chrome recommended) and a working microphone. No downloads, plugins, or installations required. You can start practicing in under a minute.' },
  { q: 'Can I practice for specific companies or roles?', a: 'Yes. Enter any job title — Software Engineer, Product Manager, Data Analyst, and more — along with your experience level and preferred difficulty. The AI tailors every question to match.' },
  { q: 'What does the performance report include?', a: 'Each report includes an overall score, breakdowns for technical skills, communication, confidence, and problem-solving, plus specific strengths, areas for improvement, and actionable recommendations.' },
  { q: 'Is my interview data kept private?', a: 'Absolutely. Your sessions, transcripts, and reports are stored securely and never shared with third parties. You can delete your history at any time from your dashboard.' },
  { q: 'Can I cancel my Pro subscription anytime?', a: 'Yes. There are no long-term contracts. Cancel anytime from your account settings and you\'ll retain access until the end of your billing period.' },
  { q: 'Does it work for non-technical interviews?', a: 'Yes. While popular with software engineers, the platform works for any role — marketing, finance, consulting, design, and more. The AI adapts its question style to your field.' },
];

function useScrollReveal() {
  const ref = useCallback((node) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    node.querySelectorAll('.lp-reveal').forEach((el) => observer.observe(el));
  }, []);
  return ref;
}

function Landing() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const revealRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing" ref={revealRef}>
      {/* ── 1. Navbar ── */}
      <nav className={`lp-nav${navScrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="lp-nav-inner">
          <a href="#" className="lp-logo">
            <span className="lp-logo-mark">AI</span>
            InterviewPrep
          </a>

          <ul className="lp-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className="lp-nav-right">
            <Link to="/login" className="btn btn-ghost btn-sm lp-nav-login">Log in</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Start free</Link>
            <ThemeToggle />
            <button
              type="button"
              className={`lp-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`lp-mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
        ))}
        <Link to="/login" onClick={closeMenu}>Log in</Link>
        <Link to="/signup" className="btn btn-primary btn-wide" onClick={closeMenu} style={{ marginTop: 8 }}>
          Start free
        </Link>
      </div>

      {/* ── 2. Hero ── */}
      <section className="lp-hero">
        <div className="landing-container">
          <div className="lp-hero-grid">
            <div className="lp-reveal">
              <div className="lp-hero-badge">
                <span className="lp-hero-badge-dot" />
                Trusted by 12,000+ job seekers
              </div>
              <h1>Ace your next interview with an AI that actually listens.</h1>
              <p className="lp-hero-sub">
                Practice real voice-based mock interviews tailored to your role and experience.
                Get instant AI feedback, detailed performance reports, and the confidence to walk into any room prepared.
              </p>
              <div className="lp-hero-ctas">
                <Link to="/signup" className="btn btn-primary btn-lg">Start practicing free</Link>
                <a href="#how-it-works" className="btn btn-secondary btn-lg">See how it works</a>
              </div>
              <p className="lp-hero-note">No credit card required · Works in Chrome · Setup in 60 seconds</p>
            </div>

            <div className="lp-mockup lp-reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="lp-blob lp-blob-1" aria-hidden="true" />
              <div className="lp-blob lp-blob-2" aria-hidden="true" />
              <div className="lp-mockup-frame">
                <div className="lp-mockup-bar">
                  <span className="lp-mockup-dot" style={{ background: '#ef4444' }} />
                  <span className="lp-mockup-dot" style={{ background: '#fbbf24' }} />
                  <span className="lp-mockup-dot" style={{ background: '#22c55e' }} />
                  <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>Live Interview — Software Engineer</span>
                </div>
                <div className="lp-mockup-body">
                  <div className="lp-mockup-chat">
                    <div className="lp-mock-bubble ai">
                      Tell me about a time you had to debug a production issue under pressure. What was your approach?
                    </div>
                    <div className="lp-mock-bubble user">
                      Our API latency spiked to 3 seconds. I checked CloudWatch metrics, found a slow DB query, added an index, and restored p99 under 200ms within an hour.
                    </div>
                    <div className="lp-mock-bubble ai">
                      Great specificity. How did you communicate the incident to stakeholders while the fix was in progress?
                    </div>
                  </div>
                  <div className="lp-mock-score">
                    <div className="lp-mock-score-ring">87</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>Session score</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Strong technical depth · Improve stakeholder comms</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Social proof ── */}
      <section className="lp-social-proof lp-reveal" aria-label="Social proof">
        <div className="landing-container">
          <div className="lp-stats-row">
            <div className="lp-stat">
              <div className="lp-stat-value">12,000+</div>
              <div className="lp-stat-label">Interviews completed</div>
            </div>
            <div className="lp-stat-divider" aria-hidden="true" />
            <div className="lp-stat">
              <div className="lp-stat-value">4.9 / 5</div>
              <div className="lp-stat-label">Average user rating</div>
            </div>
            <div className="lp-stat-divider" aria-hidden="true" />
            <div className="lp-stat">
              <div className="lp-stat-value">800+</div>
              <div className="lp-stat-label">Teams & bootcamps</div>
            </div>
          </div>
          <div className="lp-logos-row" aria-label="Companies using our platform">
            {['TechFlow', 'Nexus Labs', 'CloudBase', 'DataPulse', 'Vertex AI'].map((name) => (
              <span key={name} className="lp-logo-text">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Features ── */}
      <section className="lp-section" id="features">
        <div className="landing-container">
          <div className="lp-section-header lp-reveal">
            <h2>Everything you need to interview with confidence</h2>
            <p>From your first mock session to your final offer letter — one platform covers the full preparation journey.</p>
          </div>
          <div className="lp-features-grid">
            {FEATURES.map((f, i) => (
              <article key={f.title} className="lp-feature-card lp-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="lp-feature-icon"><f.icon /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How it works ── */}
      <section className="lp-section" id="how-it-works">
        <div className="landing-container">
          <div className="lp-section-header lp-reveal">
            <h2>Ready to practice in three simple steps</h2>
            <p>No complicated setup. No scheduling headaches. Just open, speak, and improve.</p>
          </div>
          <div className="lp-steps">
            {[
              { num: '1', title: 'Set your target role', desc: 'Enter the job title, your experience level, and preferred difficulty. The AI calibrates questions to match.' },
              { num: '2', title: 'Speak your answers', desc: 'Click the mic and respond out loud. The AI listens, asks follow-ups, and simulates a real conversation flow.' },
              { num: '3', title: 'Review & improve', desc: 'Get a detailed performance report with scores, strengths, weaknesses, and specific recommendations to act on.' },
            ].map((step, i) => (
              <div key={step.num} className="lp-step lp-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="lp-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Benefits ── */}
      <section className="lp-section lp-benefits">
        <div className="landing-container">
          <div className="lp-benefits-grid">
            <div className="lp-reveal">
              <h2>Stop rehearsing alone in front of a mirror</h2>
              <ul className="lp-benefit-list">
                {[
                  'Build muscle memory for speaking under pressure — not just reading notes silently',
                  'Identify blind spots before a real interviewer finds them for you',
                  'Track measurable improvement across sessions with scored performance reports',
                  'Practice unlimited scenarios without awkwardly asking friends for mock interviews',
                  'Walk in knowing exactly what strong answers sound like for your target role',
                ].map((item) => (
                  <li key={item}>
                    <span className="lp-benefit-check"><IconCheck /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-testimonial-highlight lp-reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="lp-stars" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => <IconStar key={i} />)}
              </div>
              <blockquote>
                &ldquo;I practiced 15 sessions over two weeks. My offer came from a company where the interview format was nearly identical to what I&apos;d rehearsed here.&rdquo;
              </blockquote>
              <cite>
                James Okonkwo
                <div className="role">Senior Backend Engineer · Plaid</div>
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Testimonials ── */}
      <section className="lp-section">
        <div className="landing-container">
          <div className="lp-section-header lp-reveal">
            <h2>Loved by job seekers at every level</h2>
            <p>From bootcamp grads to senior engineers — hear how InterviewPrep changed their outcomes.</p>
          </div>
          <div className="lp-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <article key={t.name} className="lp-testimonial-card lp-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="lp-stars" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, j) => <IconStar key={j} />)}
                </div>
                <p className="lp-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="lp-testimonial-author">
                  <div className="lp-avatar">{t.initials}</div>
                  <div>
                    <div className="lp-author-name">{t.name}</div>
                    <div className="lp-author-role">{t.role} · {t.company}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Pricing ── */}
      <section className="lp-section" id="pricing">
        <div className="landing-container">
          <div className="lp-section-header lp-reveal">
            <h2>Simple pricing, serious results</h2>
            <p>Start free and upgrade when you&apos;re ready to go all-in on your job search.</p>
          </div>
          <div className="lp-pricing-grid">
            {PRICING.map((plan, i) => (
              <article
                key={plan.name}
                className={`lp-pricing-card lp-reveal${plan.popular ? ' popular' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {plan.popular && <span className="lp-popular-badge">Most popular</span>}
                <div className="lp-plan-name">{plan.name}</div>
                <div className="lp-plan-price">
                  {plan.price} <span>{plan.period}</span>
                </div>
                <ul className="lp-plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="lp-plan-check"><IconCheck /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`btn btn-wide btn-lg ${plan.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section className="lp-section" id="faq">
        <div className="landing-container">
          <div className="lp-section-header lp-reveal">
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know before your first session.</p>
          </div>
          <div className="lp-faq-list lp-reveal">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className={`lp-faq-item${openFaq === i ? ' open' : ''}`}>
                <button
                  type="button"
                  className="lp-faq-question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  <IconChevron />
                </button>
                <div className="lp-faq-answer">
                  <div className="lp-faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Final CTA ── */}
      <section className="lp-final-cta lp-reveal">
        <h2>Your next interview doesn&apos;t have to be a gamble.</h2>
        <p>Join thousands of candidates who turned anxiety into preparation — and preparation into offers.</p>
        <Link to="/signup" className="btn btn-lg">Start your free mock interview</Link>
      </section>

      {/* ── 11. Footer ── */}
      <footer className="lp-footer">
        <div className="landing-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <a href="#" className="lp-logo">
                <span className="lp-logo-mark">AI</span>
                InterviewPrep
              </a>
              <p>AI-powered mock interviews that help you practice, improve, and land the role you deserve.</p>
            </div>
            <div className="lp-footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how-it-works">How it works</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Interview guides</a></li>
                <li><a href="#">Help center</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">API docs</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Terms of service</a></li>
                <li><a href="#">Cookie policy</a></li>
                <li><a href="#">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>&copy; {new Date().getFullYear()} InterviewPrep. All rights reserved.</span>
            <div className="lp-social-icons">
              <a href="#" aria-label="Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
