import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client.jsx";

const SAMPLE_COLLEGES = [
  { name: "NIT Trichy", branch: "CSE", closingRank: 1204, type: "NIT", state: "Tamil Nadu", nirf: 10, status: "Safe" },
  { name: "IIIT Hyderabad", branch: "CSE", closingRank: 890, type: "IIIT", state: "Telangana", nirf: 24, status: "Borderline" },
  { name: "NIT Warangal", branch: "ECE", closingRank: 2800, type: "NIT", state: "Telangana", nirf: 26, status: "Safe" },
  { name: "NIT Surathkal", branch: "CSE", closingRank: 1890, type: "NIT", state: "Karnataka", nirf: 15, status: "Safe" },
  { name: "IIIT Bangalore", branch: "CSE", closingRank: 1100, type: "IIIT", state: "Karnataka", nirf: 30, status: "Borderline" },
  { name: "NIT Calicut", branch: "CSE", closingRank: 3200, type: "NIT", state: "Kerala", nirf: 28, status: "Good Chance" },
  { name: "BITS Pilani", branch: "CSE", closingRank: 450, type: "Other", state: "Rajasthan", nirf: 18, status: "Reach" },
  { name: "IIIT Delhi", branch: "CSE", closingRank: 1600, type: "IIIT", state: "Delhi", nirf: 35, status: "Safe" },
];

const CUTOFF_DATA = {
  CSE: [
    { year: 2019, rank: 1890 },
    { year: 2020, rank: 1720 },
    { year: 2021, rank: 1810 },
    { year: 2022, rank: 1540 },
    { year: 2023, rank: 1340 },
    { year: 2024, rank: 1204 },
  ],
  ECE: [
    { year: 2019, rank: 3400 },
    { year: 2020, rank: 3200 },
    { year: 2021, rank: 3350 },
    { year: 2022, rank: 3000 },
    { year: 2023, rank: 2950 },
    { year: 2024, rank: 2800 },
  ],
  ME: [
    { year: 2019, rank: 6800 },
    { year: 2020, rank: 6500 },
    { year: 2021, rank: 6700 },
    { year: 2022, rank: 6200 },
    { year: 2023, rank: 6000 },
    { year: 2024, rank: 5800 },
  ],
};

const TESTIMONIALS = [
  { name: "Arjun S.", initials: "AS", detail: "AIR 4,200 · General · JEE Main 2024", quote: "Got my NIT Trichy seat prediction spot on. Saved hours during JoSAA counselling." },
  { name: "Priya M.", initials: "PM", detail: "AIR 8,100 · OBC-NCL · JEE Main 2024", quote: "The branch-wise cutoff trends helped me plan a realistic choice list without panic." },
  { name: "Rahul K.", initials: "RK", detail: "AIR 1,850 · General · JEE Advanced 2024", quote: "Used this daily during counselling. Branch-wise predictions were really accurate." },
  { name: "Sneha D.", initials: "SD", detail: "AIR 12,400 · EWS · JEE Main 2024", quote: "Best free tool for JEE counselling. Helped me and my whole friend group plan choices." },
];

const STEPS = [
  {
    n: 1,
    title: "Enter your details",
    desc: "Your rank, category, home state and preferred exam type (Main / Advanced).",
  },
  {
    n: 2,
    title: "See predicted colleges",
    desc: "Ranked by admission likelihood using 6 years of JoSAA round-wise data.",
  },
  {
    n: 3,
    title: "Build your choice list",
    desc: "Save, compare and share your shortlist to prepare for JoSAA counselling.",
  },
];

const GUIDE_STEPS = [
  { n: 1, title: "JEE results declared", desc: "Check your AIR on the official JoSAA / NTA portal." },
  { n: 2, title: "Predict eligible colleges", desc: "Use our predictor to shortlist 15–20 realistic options." },
  { n: 3, title: "Register on JoSAA", desc: "Complete registration and document verification on time." },
  { n: 4, title: "Fill & lock choices", desc: "Order your preferences carefully — higher aspirations first." },
  { n: 5, title: "Track seat allotment", desc: "Follow 6 JoSAA rounds and decide on freeze / float / slide." },
];

const RESOURCES = [
  { title: "JoSAA choice filling guide", tag: "Free", tagClass: "tag-teal" },
  { title: "Freeze vs float vs slide — explained", tag: "Free", tagClass: "tag-teal" },
  { title: "Branch vs college — how to decide", tag: "Free", tagClass: "tag-teal" },
  { title: "1-on-1 counsellor session", tag: "Pro", tagClass: "tag-amber" },
];

function getStatusClass(status) {
  if (status === "Safe") return "status-safe";
  if (status === "Good Chance") return "status-good";
  if (status === "Borderline") return "status-borderline";
  if (status === "Reach") return "status-reach";
  return "";
}

function getTypeClass(type) {
  if (type === "NIT") return "type-nit";
  if (type === "IIIT") return "type-iiit";
  return "type-other";
}

function CutoffChart({ data }) {
  const ranks = data.map((d) => d.rank);
  const minR = Math.min(...ranks);
  const maxR = Math.max(...ranks);
  const W = 560;
  const H = 80;
  const pad = { l: 40, r: 20, t: 10, b: 24 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const xScale = (i) => pad.l + (i / (data.length - 1)) * innerW;
  const yScale = (r) => pad.t + ((r - minR) / (maxR - minR || 1)) * innerH;

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.rank)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="cutoff-chart-svg" preserveAspectRatio="xMidYMid meet">
      <polyline points={points} className="chart-line" fill="none" />
      {data.map((d, i) => (
        <g key={d.year}>
          <circle cx={xScale(i)} cy={yScale(d.rank)} r="4" className="chart-dot" />
          <text x={xScale(i)} y={H - 4} textAnchor="middle" className="chart-year">
            {d.year}
          </text>
          <text x={xScale(i)} y={yScale(d.rank) - 8} textAnchor="middle" className="chart-rank">
            {d.rank.toLocaleString("en-IN")}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Home() {
  const { user, logout } = useAuth();

  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("OPEN");
  const [gender, setGender] = useState("Gender-Neutral");
  const [examType, setExamType] = useState("JEE Main");
  const [predicted, setPredicted] = useState([]);
  const [searched, setSearched] = useState(false);
  const [effectiveRank, setEffectiveRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [explorerFilter, setExplorerFilter] = useState("All");

  const [cutoffBranch, setCutoffBranch] = useState("CSE");

  const computeAdjustedRank = (rankValue) => {
    const categoryFactor =
      category === "General"
        ? 1
        : category === "OBC-NCL"
        ? 0.9
        : category === "EWS"
        ? 0.92
        : 0.85;
    const genderFactor = gender === "Female" ? 0.92 : gender === "Other" ? 0.95 : 1;
    const examFactor = examType === "JEE Advanced" ? 0.95 : 1;
    return Math.max(1, Math.round(rankValue * categoryFactor * genderFactor * examFactor));
  };

  const handlePredict = async () => {
    if (!rank || parseInt(rank) <= 0) return;
    setLoading(true);
    setError(null);
    setSearched(false);

    const requestedRank = parseInt(rank, 10);
    const adjustedRank = computeAdjustedRank(requestedRank);

    try {
      const response = await api.post("/colleges/predict", {
        rank: requestedRank,
        category,
        gender,
        examType,
      });
      setPredicted(response.data || []);
      setEffectiveRank(adjustedRank);
      setSearched(true);
    } catch (err) {
      setError("Unable to fetch predictions from the server. Please try again.");
      setPredicted([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const explorerColleges =
    explorerFilter === "All"
      ? SAMPLE_COLLEGES
      : SAMPLE_COLLEGES.filter((c) => c.type === explorerFilter);

  return (
    <div className="site">

      {/* ── Announcement bar ── */}
      <div className="top-announce">
        Free for all JEE aspirants &nbsp;·&nbsp; 1,200+ colleges listed &nbsp;·&nbsp; 50,000+ predictions made
      </div>

      {/* ── Navigation ── */}
      <nav className="site-nav">
        <div className="brand">
          <button className="menu-btn" aria-label="menu">☰</button>
          <div className="logo">CollegeSearchPortal</div>
        </div>
        <div className="nav-actions">
          {!user ? (
            <>
              <a className="btn ghost" href="/login">Login / Register</a>
              <a className="btn primary" href="/search">Predict now</a>
            </>
          ) : (
            <>
              <span className="user-greeting">Hi, {user.fullName}</span>
              <button className="btn ghost" onClick={logout}>Logout</button>
              <a className="btn primary" href="/search">Predict now</a>
            </>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════
          SECTION 1 — Hero with rank input
      ══════════════════════════════════════ */}
      <header className="hero">
        <span className="hero-badge">Free for JEE 2025 students</span>
        <h1 className="hero-heading">
          Find the right college<br />for your JEE rank
        </h1>
        <p className="hero-sub">
          Predict admission chances across 1,200+ NITs, IIITs &amp; GFTIs — instantly, for free.
        </p>

        <div className="hero-search">
          <input
            type="number"
            placeholder="Enter your rank"
            className="rank-input"
            min="1"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePredict()}
          />
          <select
            className="rank-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {[
              "OBC-NCL (PwD)",
              "EWS",
              "OPEN (PwD)",
              "ST",
              "OPEN",
              "SC (PwD)",
              "SC",
              "ST (PwD)",
              "EWS (PwD)",
              "OBC-NCL",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="rank-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            {["Female-only (including Supernumerary)", "Gender-Neutral"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select
            className="rank-select"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option>JEE Main</option>
            <option>JEE Advanced</option>
          </select>
          <button className="btn primary hero-cta" onClick={handlePredict} disabled={loading}>
            {loading ? "Predicting…" : "Predict colleges"}
          </button>
        </div>

        <p className="hero-note">No login required &nbsp;·&nbsp; Results in under 2 seconds</p>
        {error && <p className="hero-error">{error}</p>}

        {searched && (
          <div className="hero-results">
            {predicted.length === 0 ? (
              <p className="hero-no-results">No colleges found for this combination. Try a higher rank or different category/gender/exam type.</p>
            ) : (
              <>
                <p className="hero-results-context">
                  Showing predicted colleges for {examType}, {category}, {gender}, rank {rank}.
                  {effectiveRank && effectiveRank !== parseInt(rank) ? (
                    <span> Effective prediction rank: {effectiveRank}.</span>
                  ) : null}
                </p>
                <div className="hero-results-grid">
                  {predicted.slice(0, 3).map((c) => (
                    <div className="hero-result-card" key={c.id + c.course}>
                      <p className="result-name">{c.name} — {c.course}</p>
                      <p className="result-rank">Closing rank: {c.closingRank.toLocaleString("en-IN")}</p>
                      <span className={`result-status ${getStatusClass(c.status)}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
                <p className="hero-results-note">
                  Showing 3 of {predicted.length} matches —{" "}
                  <a className="link-teal" href="/search">view all results →</a>
                </p>
              </>
            )}
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          SECTION 2 — Stats strip
      ══════════════════════════════════════ */}
      <div className="stats-strip">
        <div className="stat">
          <span className="stat-num">1,200+</span>
          <span className="stat-label">Colleges listed</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">50,000+</span>
          <span className="stat-label">Predictions made</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">98%</span>
          <span className="stat-label">Accuracy rate</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">6 yrs</span>
          <span className="stat-label">Of JoSAA cutoff data</span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 3 — How it works
      ══════════════════════════════════════ */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">Three steps from rank to college list</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className={`step-card ${s.n === 2 ? "step-card--active" : ""}`} key={s.n}>
              <div className={`step-num ${s.n === 2 ? "step-num--active" : ""}`}>{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — College explorer
      ══════════════════════════════════════ */}
      <section className="college-explorer">
        <div className="section-header">
          <h2 className="section-title">Explore colleges</h2>
          <p className="section-sub">Browse without entering a rank — filter by type</p>
        </div>

        <div className="explorer-filters">
          {["All", "NIT", "IIIT", "Other"].map((f) => (
            <button
              key={f}
              className={`filter-pill ${explorerFilter === f ? "filter-pill--active" : ""}`}
              onClick={() => setExplorerFilter(f)}
            >
              {f === "Other" ? "GFTIs / Others" : f + "s"}
            </button>
          ))}
        </div>

        <div className="explorer-grid">
          {explorerColleges.map((c) => (
            <div className="explorer-card" key={c.name}>
              <div className="explorer-card-header">
                <p className="explorer-name">{c.name}</p>
                <span className={`type-badge ${getTypeClass(c.type)}`}>{c.type}</span>
              </div>
              <p className="explorer-meta">{c.state} &nbsp;·&nbsp; NIRF #{c.nirf}</p>
              <div className="explorer-ranks">
                <span className="rank-chip">{c.branch}: {c.closingRank.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="explorer-footer">
          Showing {explorerColleges.length} of 1,200+ colleges &nbsp;
          <a className="link-teal" href="/search">Browse all →</a>
        </p>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — Cutoff trend chart
      ══════════════════════════════════════ */}
      <section className="cutoff-trend">
        <div className="section-header">
          <h2 className="section-title">Cutoff trends</h2>
          <p className="section-sub">See how closing ranks have moved over 6 years — NIT Trichy</p>
        </div>

        <div className="trend-card">
          <div className="trend-card-header">
            <div>
              <p className="trend-college">NIT Trichy — General, Home State</p>
              <p className="trend-round">Closing rank · JoSAA Round 6</p>
            </div>
            <div className="trend-filters">
              {Object.keys(CUTOFF_DATA).map((b) => (
                <button
                  key={b}
                  className={`filter-pill ${cutoffBranch === b ? "filter-pill--active" : ""}`}
                  onClick={() => setCutoffBranch(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <CutoffChart data={CUTOFF_DATA[cutoffBranch]} />

          <p className="trend-note">
            Cutoff is getting more competitive each year. Plan your choices accordingly. &nbsp;
            <a className="link-teal" href="/cutoffs">See all colleges →</a>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — JoSAA counselling guide
      ══════════════════════════════════════ */}
      <section className="guide">
        <div className="section-header">
          <h2 className="section-title">JoSAA counselling guide</h2>
          <p className="section-sub">Everything you need to navigate seat allotment</p>
        </div>

        <div className="guide-grid">
          <div className="guide-steps">
            {GUIDE_STEPS.map((s, i) => (
              <div className="guide-step" key={s.n}>
                <div className="guide-step-left">
                  <div className={`guide-num ${i === 0 ? "guide-num--active" : ""}`}>{s.n}</div>
                  {i < GUIDE_STEPS.length - 1 && <div className="guide-connector" />}
                </div>
                <div className="guide-step-content">
                  <p className="guide-step-title">{s.title}</p>
                  <p className="guide-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="guide-resources">
            <p className="resources-heading">Quick resources</p>
            {RESOURCES.map((r) => (
              <div className="resource-row" key={r.title}>
                <p className="resource-title">{r.title}</p>
                <span className={`resource-tag ${r.tagClass}`}>{r.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — Testimonials
      ══════════════════════════════════════ */}
      <section className="testimonials">
        <div className="section-header">
          <h2 className="section-title">Trusted by JEE aspirants across India</h2>
          <p className="section-sub">Real students, real ranks, real results</p>
        </div>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-detail">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-brand">CollegeSearchPortal</div>
        <div className="footer-links">
          <div>
            <strong>About Us</strong>
            <ul><li>Learn More</li><li>Careers</li></ul>
          </div>
          <div>
            <strong>Help Center</strong>
            <ul><li>Support</li><li>FAQ</li></ul>
          </div>
          <div>
            <strong>Join our community</strong>
            <ul><li>Telegram</li><li>Instagram</li></ul>
          </div>
        </div>
        <p className="footer-copy">© 2025 CollegeSearchPortal. Made for JEE aspirants.</p>
      </footer>

    </div>
  );
}
