import { useState, useEffect } from 'react';
import * as api from './api';

// ─── STATUS CONFIG ───────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:         { color: '#6b7280', bg: '#f3f4f6', label: 'Pending' },
  shortlisted:     { color: '#2563eb', bg: '#eff6ff', label: 'Shortlisted' },
  rejected:        { color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
  interview_ready: { color: '#059669', bg: '#ecfdf5', label: 'Interview Ready' },
  interviewed:     { color: '#7c3aed', bg: '#f5f3ff', label: 'Interviewed' },
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, color:cfg.color, background:cfg.bg }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.color }} />
      {cfg.label}
    </span>
  );
}

function ScoreBar({ value, max=100, color='#2563eb' }) {
  const pct = Math.min(100,(value/max)*100);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:6, background:'#e5e7eb', borderRadius:3, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:3, transition:'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize:12, fontWeight:600, color:'#374151', minWidth:32 }}>{value?.toFixed(0)?? '—'}</span>
    </div>
  );
}

function Toast({ message, type='info', onClose }) {
  useEffect(() => { const t = setTimeout(onClose,5000); return ()=>clearTimeout(t); },[onClose]);
  const colors = { info:'#2563eb', error:'#dc2626', success:'#059669', loading:'#7c3aed' };
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:1000, background:'#fff', border:`1.5px solid ${colors[type]}20`, borderLeft:`4px solid ${colors[type]}`, borderRadius:12, padding:'14px 18px', maxWidth:360, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', display:'flex', alignItems:'flex-start', gap:10, animation:'slideIn 0.3s ease' }}>
      <span style={{ fontSize:18 }}>{type==='success'?'✅':type==='error'?'❌':type==='loading'?'⏳':'ℹ️'}</span>
      <div style={{ flex:1, fontSize:13, color:'#374151', lineHeight:1.5 }}>{message}</div>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:16 }}>×</button>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email && password) {
        onLogin({ email });
      } else {
        setError('Please enter your email and password.');
        setLoading(false);
      }
    }, 800);
  };

  const features = [
    { icon:'📊', title:'Actionable Scorecard', desc:'Review candidates based on different traits, skills, communication, technical ability and overall fit.' },
    { icon:'⚡', title:'Auto Advance', desc:'Automatically move candidates to the next recruitment stage once predefined hiring criteria are met.' },
    { icon:'🤖', title:'Evaluate with AI', desc:'Use AI to intelligently evaluate resumes, interview responses and candidate profiles against job requirements.' },
    { icon:'💻', title:'Analyze GitHub Profiles', desc:'Automatically analyze GitHub repositories, coding activity and technical contributions of candidates.' },
    { icon:'🏆', title:'Score & Rank Candidates', desc:'Generate AI-powered scores and rankings to identify the strongest applicants quickly and confidently.' },
    { icon:'📧', title:'Send Test Links', desc:'Automatically send assessment links to shortlisted candidates and track completion status.' },
  ];

  return (
    <div style={{ minHeight:'100vh', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background:'#fff' }}>
      <style>{`
        @keyframes slideIn { from { transform:translateX(100px); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes fadeUp { from { transform:translateY(30px); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={{ padding:'0 60px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:'#111827', letterSpacing:'-0.3px' }}>VISL AI Labs</div>
            <div style={{ fontSize:10, color:'#6b7280', letterSpacing:'0.5px', textTransform:'uppercase' }}>Intelligent Screening</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <a href="#features" style={{ padding:'8px 16px', color:'#6b7280', fontSize:14, textDecoration:'none', fontWeight:500 }}>Features</a>
          <a href="#login" style={{ padding:'8px 20px', background:'#111827', color:'#fff', borderRadius:8, fontSize:14, fontWeight:600, textDecoration:'none' }}>Recruiter Login →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding:'80px 60px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ animation:'fadeUp 0.6s ease' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'#eff6ff', borderRadius:20, marginBottom:24 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb', display:'inline-block' }} />
            <span style={{ fontSize:13, color:'#2563eb', fontWeight:600 }}>AI-Powered Recruitment Platform</span>
          </div>
          <h1 style={{ fontSize:52, fontWeight:900, color:'#111827', lineHeight:1.1, letterSpacing:'-2px', marginBottom:20 }}>
            Candidate Screening<br />
            <span style={{ background:'linear-gradient(135deg,#2563eb,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>at Ease with AI</span>
          </h1>
          <p style={{ fontSize:18, color:'#6b7280', lineHeight:1.7, marginBottom:36, maxWidth:500 }}>
            We take the busywork out of screening with an AI-powered solution that instantly helps recruiters identify the best candidates with confidence.
          </p>
          <div style={{ display:'flex', gap:12 }}>
            <a href="#login" style={{ padding:'14px 28px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', borderRadius:10, fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 14px rgba(37,99,235,0.4)' }}>Get Started Free →</a>
            <a href="#features" style={{ padding:'14px 28px', background:'#f9fafb', color:'#111827', borderRadius:10, fontSize:15, fontWeight:600, textDecoration:'none', border:'1.5px solid #e5e7eb' }}>See Features</a>
          </div>
          <div style={{ display:'flex', gap:24, marginTop:40 }}>
            {[['500+','Candidates Screened'],['98%','Accuracy Rate'],['10x','Faster Hiring']].map(([num,label])=>(
              <div key={label}>
                <div style={{ fontSize:28, fontWeight:800, color:'#111827', letterSpacing:'-1px' }}>{num}</div>
                <div style={{ fontSize:12, color:'#9ca3af', fontWeight:500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGIN CARD */}
        <div id="login" style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:20, padding:40, boxShadow:'0 20px 60px rgba(0,0,0,0.08)', animation:'fadeUp 0.8s ease' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, margin:'0 auto 16px' }}>🔐</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#111827', marginBottom:6 }}>Recruiter Login</h2>
            <p style={{ fontSize:14, color:'#9ca3af' }}>Access your recruitment dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Organization Email</label>
              <input type="email" placeholder="recruiter@company.com" value={email} onChange={e=>setEmail(e.target.value)}
                style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', transition:'border 0.2s' }}
                onFocus={e=>e.target.style.border='1.5px solid #2563eb'}
                onBlur={e=>e.target.style.border='1.5px solid #e5e7eb'} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
                style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', transition:'border 0.2s' }}
                onFocus={e=>e.target.style.border='1.5px solid #2563eb'}
                onBlur={e=>e.target.style.border='1.5px solid #e5e7eb'} />
            </div>
            {error && <div style={{ padding:'10px 14px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, fontSize:13, color:'#dc2626', marginBottom:16 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.3)', transition:'opacity 0.2s' }}>
              {loading ? '⏳ Signing in...' : 'Login to Dashboard →'}
            </button>
          </form>
          <div style={{ marginTop:20, padding:'14px', background:'#f8faff', borderRadius:10, border:'1px solid #dbeafe' }}>
            <div style={{ fontSize:12, color:'#6b7280', textAlign:'center', marginBottom:8 }}>Demo credentials</div>
            <div style={{ fontSize:12, color:'#2563eb', textAlign:'center', fontFamily:'monospace' }}>
              recruiter@visl.ai &nbsp;/&nbsp; visl@2024
            </div>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section style={{ padding:'60px', background:'#f8f9fb', borderTop:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          {/* LEFT */}
          <div>
            <h2 style={{ fontSize:42, fontWeight:900, color:'#111827', lineHeight:1.15, letterSpacing:'-1.5px', marginBottom:20 }}>
              Want to know how{' '}
              <span style={{ background:'linear-gradient(135deg,#2563eb,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                VISL AI Labs AI-powered Candidate Screening Platform
              </span>{' '}
              is helping recruiters in getting their ideal candidates?
            </h2>
            <p style={{ fontSize:16, color:'#6b7280', lineHeight:1.8, marginBottom:20 }}>
              We take the busywork out of screening with an AI-powered solution that instantly helps recruiters find top candidates faster, reduce manual effort, and make smarter hiring decisions through AI-powered evaluation and automated workflows.
            </p>
            <p style={{ fontSize:14, color:'#9ca3af', fontWeight:500 }}>
              Here's some features of <strong style={{ color:'#111827' }}>VISL AI Labs platform</strong>
            </p>
            {/* CURVED ARROW */}
            <div style={{ marginTop:20 }}>
              <svg width="120" height="80" viewBox="0 0 120 80">
                <path d="M 10 20 Q 60 10 90 50 L 85 45 M 90 50 L 82 55" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {/* RIGHT — FEATURE CARDS */}
          <div id="features" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {features.map((f,i)=>(
              <div key={i} style={{ background:'#fff', borderRadius:16, padding:'20px', border:'1.5px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', cursor:'default', transition:'all 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 24px rgba(37,99,235,0.12)'; e.currentTarget.style.borderColor='#bfdbfe'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.transform='none'; }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'30px 60px', background:'#0f172a', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🤖</div>
          <span style={{ color:'#94a3b8', fontSize:13, fontWeight:600 }}>VISL AI Labs</span>
        </div>
        <span style={{ color:'#475569', fontSize:12 }}>© 2024 VISL AI Labs. AI-Powered Recruitment Platform.</span>
      </footer>
    </div>
  );
}

// ─── DASHBOARD COMPONENTS ─────────────────────────────────────────
function KpiCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:'20px 24px', display:'flex', flexDirection:'column', gap:8, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize:13, color:'#6b7280', fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:22, width:40, height:40, borderRadius:10, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>
      </div>
      <div style={{ fontSize:32, fontWeight:700, color:'#111827', letterSpacing:'-1px' }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:'#9ca3af' }}>{sub}</div>}
    </div>
  );
}

function PipelineStep({ num, title, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:`1.5px solid ${open?'#2563eb':'#e5e7eb'}`, borderRadius:14, marginBottom:10, overflow:'hidden', boxShadow:open?'0 0 0 3px #eff6ff':'none', transition:'all 0.2s' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background:open?'#f8faff':'#fff', border:'none', cursor:'pointer', textAlign:'left' }}>
        <div style={{ width:36, height:36, borderRadius:10, background:open?'#2563eb':'#f3f4f6', color:open?'#fff':'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0, transition:'all 0.2s' }}>
          {icon||num}
        </div>
        <div style={{ flex:1, fontWeight:600, fontSize:15, color:'#111827' }}>{title}</div>
        <span style={{ color:'#9ca3af', fontSize:13, transform:open?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s' }}>▾</span>
      </button>
      {open && <div style={{ padding:'16px 20px 20px', background:'#fafbff', borderTop:'1px solid #e5e7eb' }}>{children}</div>}
    </div>
  );
}

function CandidateRow({ c, rank }) {
  const [expanded, setExpanded] = useState(false);
  const score = c.total_score??0;
  const scoreColor = score>=70?'#059669':score>=50?'#d97706':'#dc2626';
  return (
    <>
      <tr onClick={()=>setExpanded(!expanded)} style={{ cursor:'pointer', borderBottom:'1px solid #f3f4f6', background:expanded?'#f8faff':rank%2===0?'#fff':'#fafafa', transition:'background 0.15s' }}>
        <td style={{ padding:'14px 16px', color:'#9ca3af', fontSize:12, fontWeight:600 }}>#{rank}</td>
        <td style={{ padding:'14px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', flexShrink:0, background:`hsl(${(c.name?.charCodeAt(0)||0)*37%360},60%,85%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:`hsl(${(c.name?.charCodeAt(0)||0)*37%360},50%,30%)` }}>
              {c.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:'#111827' }}>{c.name}</div>
              <div style={{ fontSize:12, color:'#9ca3af' }}>{c.email}</div>
            </div>
          </div>
        </td>
        <td style={{ padding:'14px 16px', fontSize:13, color:'#6b7280' }}>{c.college}</td>
        <td style={{ padding:'14px 16px', fontSize:13 }}>{c.cgpa}</td>
        <td style={{ padding:'14px 16px', minWidth:120 }}><ScoreBar value={c.ai_score} max={100} color="#2563eb"/></td>
        <td style={{ padding:'14px 16px', minWidth:120 }}><ScoreBar value={c.github_score} max={100} color="#7c3aed"/></td>
        <td style={{ padding:'14px 16px' }}><span style={{ fontSize:20, fontWeight:700, color:scoreColor }}>{score.toFixed(1)}</span></td>
        <td style={{ padding:'14px 16px' }}><StatusBadge status={c.status}/></td>
        <td style={{ padding:'14px 16px' }}>{c.meet_link?<a href={c.meet_link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'5px 12px', background:'#eff6ff', color:'#2563eb', borderRadius:8, fontSize:12, fontWeight:600, textDecoration:'none', border:'1px solid #bfdbfe' }}>🎥 Join</a>:'—'}</td>
      </tr>
      {expanded&&(
        <tr style={{ background:'#f0f4ff' }}>
          <td colSpan={9} style={{ padding:'16px 20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {c.best_ai_project&&<div style={{ background:'#fff', borderRadius:10, padding:14, border:'1px solid #e5e7eb' }}><div style={{ fontSize:11, fontWeight:700, color:'#2563eb', marginBottom:6, textTransform:'uppercase' }}>Best AI Project</div><div style={{ fontSize:13, color:'#374151' }}>{c.best_ai_project}</div></div>}
              {c.research_work&&<div style={{ background:'#fff', borderRadius:10, padding:14, border:'1px solid #e5e7eb' }}><div style={{ fontSize:11, fontWeight:700, color:'#7c3aed', marginBottom:6, textTransform:'uppercase' }}>Research Work</div><div style={{ fontSize:13, color:'#374151' }}>{c.research_work}</div></div>}
              {c.ai_reasoning&&<div style={{ background:'#fff', borderRadius:10, padding:14, border:'1px solid #e5e7eb' }}><div style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:6, textTransform:'uppercase' }}>AI Reasoning</div><div style={{ fontSize:13, color:'#374151', lineHeight:1.6 }}>{c.ai_reasoning}</div></div>}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobId, setJobId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [testLink, setTestLink] = useState('');
  const [threshold, setThreshold] = useState(60);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState('');
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('total_score');

  const showToast = (message, type='info') => setToast({ message, type });
  const run = async (label, fn) => {
    setLoading(label); showToast(label+'…','loading');
    try { const r=await fn(); showToast(r.data.message||'Done','success'); }
    catch(e) { showToast('Error: '+(e.response?.data?.detail||e.message),'error'); }
    finally { setLoading(''); loadCandidates(); }
  };
  const loadCandidates = async () => { try { const r=await api.getCandidates(); setCandidates(r.data); } catch(e){} };
  useEffect(()=>{ if(user) loadCandidates(); },[user]);

  const counts = candidates.reduce((a,c)=>{ a[c.status]=(a[c.status]||0)+1; return a; },{});
  const filteredCandidates = candidates
    .filter(c=>{ const ms=!searchQuery||c.name?.toLowerCase().includes(searchQuery.toLowerCase())||c.email?.toLowerCase().includes(searchQuery.toLowerCase())||c.college?.toLowerCase().includes(searchQuery.toLowerCase()); const mst=filterStatus==='all'||c.status===filterStatus; return ms&&mst; })
    .sort((a,b)=>(b[sortBy]??0)-(a[sortBy]??0));
  const avgScore = candidates.length?(candidates.reduce((s,c)=>s+(c.total_score||0),0)/candidates.length).toFixed(1):'—';
  const topCandidate = candidates.length?candidates.reduce((best,c)=>(c.total_score>(best?.total_score??0)?c:best),null):null;
  const shortlistRate = candidates.length?((counts.shortlisted||0)/candidates.length*100).toFixed(0):0;
  const interviewRate = (counts.shortlisted||0)>0?((counts.interview_ready||0)/(counts.shortlisted||1)*100).toFixed(0):0;

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fb', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        @keyframes slideIn { from { transform:translateX(100px); opacity:0; } to { transform:none; opacity:1; } }
        * { box-sizing:border-box; margin:0; padding:0; }
        button:hover { opacity:0.9; }
        tr:hover td { background:#f0f4ff !important; transition:background 0.15s; }
        input,textarea,select { font-family:inherit; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:#f1f5f9; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
      `}</style>

      {/* HEADER */}
      <header style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e40af 100%)', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:64, boxShadow:'0 2px 16px rgba(0,0,0,0.2)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:16, letterSpacing:'-0.3px' }}>VISL AI Labs</div>
            <div style={{ color:'#93c5fd', fontSize:11 }}>Intelligent Candidate Screening</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {['pipeline','candidates','analytics'].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:'7px 16px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, background:activeTab===tab?'rgba(255,255,255,0.15)':'transparent', color:activeTab===tab?'#fff':'#93c5fd', textTransform:'capitalize' }}>
              {tab==='pipeline'?'⚡':tab==='candidates'?'👥':'📊'} {tab}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff' }}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span style={{ color:'#93c5fd', fontSize:12 }}>{user.email}</span>
          </div>
          <button onClick={()=>setUser(null)} style={{ padding:'6px 12px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:6, color:'#93c5fd', fontSize:12, cursor:'pointer' }}>Logout</button>
        </div>
      </header>

      <main style={{ maxWidth:1300, margin:'0 auto', padding:'28px 24px' }}>

        {/* KPI ROW */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:28 }}>
          <KpiCard label="Total Candidates" value={candidates.length} icon="👤" color="#2563eb" sub="Across all stages"/>
          <KpiCard label="Shortlisted" value={counts.shortlisted||0} icon="⭐" color="#d97706" sub={`${shortlistRate}% pass rate`}/>
          <KpiCard label="Interview Ready" value={counts.interview_ready||0} icon="✅" color="#059669" sub="Passed assessment"/>
          <KpiCard label="Avg AI Score" value={avgScore} icon="🧠" color="#7c3aed" sub="Out of 100 points"/>
          <KpiCard label="Top Candidate" value={topCandidate?.name?.split(' ')[0]||'—'} icon="🏆" color="#dc2626" sub={topCandidate?`Score: ${topCandidate.total_score?.toFixed(1)}`:'No data yet'}/>
        </div>

        {/* PIPELINE STATUS BAR */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'14px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:0, overflow:'hidden' }}>
          {Object.entries(STATUS_CONFIG).map(([key,cfg])=>{
            const count=counts[key]||0; const total=candidates.length||1; const pct=(count/total*100).toFixed(0);
            return (
              <div key={key} onClick={()=>setFilterStatus(filterStatus===key?'all':key)}
                style={{ flex:1, padding:'10px 14px', cursor:'pointer', borderRadius:8, background:filterStatus===key?cfg.bg:'transparent', border:filterStatus===key?`1.5px solid ${cfg.color}30`:'1.5px solid transparent', display:'flex', flexDirection:'column', gap:3 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:11, fontWeight:600, color:cfg.color, textTransform:'uppercase', letterSpacing:0.5 }}>{cfg.label}</span>
                  <span style={{ fontSize:18, fontWeight:700, color:'#111827' }}>{count}</span>
                </div>
                <div style={{ height:4, background:'#e5e7eb', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:cfg.color, borderRadius:2 }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── PIPELINE TAB ── */}
        {activeTab==='pipeline'&&(
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20 }}>
            <div>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', marginBottom:14 }}>⚡ Recruitment Pipeline</h2>

              <PipelineStep num="1" title="Upload Candidate CSV" icon="📁">
                <p style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>Upload a CSV with candidate details. Columns: name, email, college, branch, cgpa, best_ai_project, research_work, github_profile, resume_link</p>
                <label style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', border:'2px dashed #bfdbfe', borderRadius:10, cursor:'pointer', background:'#f0f9ff', color:'#2563eb', fontSize:13, fontWeight:500 }}>
                  📤 Choose CSV file
                  <input type="file" accept=".csv" style={{ display:'none' }} onChange={e=>run('Uploading candidates',()=>api.uploadCandidates(e.target.files[0]))}/>
                </label>
              </PipelineStep>

              <PipelineStep num="2" title="Define Job Description" icon="📝">
                <input placeholder="Job title (e.g. AI/ML Engineer)" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:13, marginBottom:10, outline:'none' }}/>
                <textarea placeholder="Paste full job description here..." value={jobDesc} onChange={e=>setJobDesc(e.target.value)} rows={4} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:13, resize:'vertical', marginBottom:10, outline:'none' }}/>
                <button onClick={()=>run('Saving job description',async()=>{ const r=await api.addJobDescription(jobTitle,jobDesc); setJobId(r.data.id); return r; })} style={{ padding:'10px 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>Save Job Description</button>
                {jobId&&<span style={{ marginLeft:10, fontSize:12, color:'#059669' }}>✓ Saved</span>}
              </PipelineStep>

              <PipelineStep num="3" title="Process Resumes" icon="📄">
                <p style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>Downloads and extracts text from all candidate resume PDFs.</p>
                <button onClick={()=>run('Processing resumes',api.processResumes)} disabled={!!loading} style={{ padding:'10px 20px', background:'#7c3aed', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>Process All Resumes</button>
              </PipelineStep>

              <PipelineStep num="4" title="Run AI Evaluation" icon="🧠">
                {!jobId&&<div style={{ padding:'10px 14px', background:'#fef3c7', borderRadius:8, fontSize:13, color:'#92400e', marginBottom:12 }}>⚠ Save a job description first (Step 2)</div>}
                <p style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>Claude AI scores each candidate on relevance, technical depth, projects, and research against the job description.</p>
                <button onClick={()=>run('Running AI evaluation (this may take a few minutes)',()=>api.runEvaluation(jobId))} disabled={!jobId||!!loading} style={{ padding:'10px 20px', background:!jobId?'#9ca3af':'#0f172a', color:'#fff', border:'none', borderRadius:8, cursor:!jobId?'not-allowed':'pointer', fontSize:13, fontWeight:600 }}>🤖 Run AI Evaluation</button>
              </PipelineStep>

              <PipelineStep num="5" title="Shortlist Candidates" icon="⭐">
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <span style={{ fontSize:13, color:'#6b7280' }}>Score threshold:</span>
                  <input type="number" value={threshold} onChange={e=>setThreshold(e.target.value)} min="0" max="100" style={{ width:70, padding:'8px 10px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:13, fontWeight:700, outline:'none' }}/>
                  <span style={{ fontSize:13, color:'#9ca3af' }}>/ 100</span>
                  <div style={{ flex:1, height:4, background:'#e5e7eb', borderRadius:2 }}>
                    <div style={{ width:`${threshold}%`, height:'100%', background:'#d97706', borderRadius:2 }}/>
                  </div>
                </div>
                <button onClick={()=>run('Shortlisting candidates',()=>api.shortlistCandidates(threshold))} style={{ padding:'10px 20px', background:'#d97706', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>Shortlist Candidates</button>
              </PipelineStep>

              <PipelineStep num="6" title="Send Assessment Links" icon="📧">
                <input placeholder="Paste test URL (e.g. https://forms.gle/...)" value={testLink} onChange={e=>setTestLink(e.target.value)} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:13, marginBottom:10, outline:'none' }}/>
                <button onClick={()=>run('Sending assessment links',()=>api.sendTestLinks(testLink))} style={{ padding:'10px 20px', background:'#059669', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>Send to All Shortlisted</button>
              </PipelineStep>

              <PipelineStep num="7" title="Upload Test Results" icon="📊">
                <p style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>Upload results CSV with columns: email, test_la, test_code. Candidates averaging ≥50 move to Interview Ready.</p>
                <label style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', border:'2px dashed #bbf7d0', borderRadius:10, cursor:'pointer', background:'#f0fdf4', color:'#059669', fontSize:13, fontWeight:500 }}>
                  📥 Upload Results CSV
                  <input type="file" accept=".csv" style={{ display:'none' }} onChange={e=>run('Uploading test results',()=>api.uploadTestResults(e.target.files[0]))}/>
                </label>
              </PipelineStep>

              <PipelineStep num="8" title="Schedule Interviews" icon="📅">
                <p style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>Creates Google Calendar events with auto-generated Meet links for all interview-ready candidates.</p>
                <button onClick={()=>run('Scheduling interviews via Google Calendar',api.scheduleInterviews)} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>🗓 Schedule All Interviews</button>
              </PipelineStep>
            </div>

            {/* RIGHT PANEL — AI SCORING MODEL */}
            <div>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', marginBottom:14 }}>🎯 AI Scoring Model</h2>
              <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:20, marginBottom:16 }}>
                {[
                  { label:'Resume vs JD Match', weight:'50%', color:'#2563eb', desc:'Relevance · Technical depth · Projects · Research' },
                  { label:'GitHub Analysis', weight:'30%', color:'#7c3aed', desc:'Repo quality · AI/ML presence · Activity' },
                  { label:'Academic Score', weight:'20%', color:'#059669', desc:'CGPA normalized to 100 scale' },
                ].map((item,i)=>(
                  <div key={i} style={{ marginBottom:i<2?20:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{item.label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:item.color }}>{item.weight}</span>
                    </div>
                    <div style={{ height:6, background:'#e5e7eb', borderRadius:3, marginBottom:5, overflow:'hidden' }}>
                      <div style={{ width:item.weight, height:'100%', background:item.color, borderRadius:3 }}/>
                    </div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', marginBottom:14 }}>📋 Quick Stats</h2>
              <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:20 }}>
                {[
                  { label:'Total Evaluated', value:candidates.filter(c=>c.ai_score).length, icon:'🧠' },
                  { label:'Avg GitHub Score', value:candidates.filter(c=>c.github_score).length?(candidates.reduce((s,c)=>s+(c.github_score||0),0)/candidates.filter(c=>c.github_score).length).toFixed(1):'—', icon:'💻' },
                  { label:'Shortlist Rate', value:`${shortlistRate}%`, icon:'⭐' },
                  { label:'Interview Rate', value:`${interviewRate}%`, icon:'📅' },
                ].map((item,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<3?'1px solid #f3f4f6':'none' }}>
                    <span style={{ fontSize:13, color:'#6b7280', display:'flex', alignItems:'center', gap:8 }}>{item.icon} {item.label}</span>
                    <span style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CANDIDATES TAB ── */}
        {activeTab==='candidates'&&(
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#111827', flex:1 }}>👥 Candidate Rankings</h2>
              <input placeholder="🔍 Search by name, email, college…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{ padding:'9px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:13, width:260, outline:'none' }}/>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'9px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:13, outline:'none' }}>
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:'9px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:13, outline:'none' }}>
                <option value="total_score">Sort: Total Score</option>
                <option value="ai_score">Sort: AI Score</option>
                <option value="github_score">Sort: GitHub Score</option>
                <option value="cgpa">Sort: CGPA</option>
              </select>
            </div>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
                  <thead>
                    <tr style={{ background:'#0f172a' }}>
                      {['Rank','Candidate','College','CGPA','AI Score','GitHub','Total','Status','Interview'].map(h=>(
                        <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontSize:12, fontWeight:600, color:'#94a3b8', letterSpacing:0.5 }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.length===0?(
                      <tr><td colSpan={9} style={{ padding:48, textAlign:'center', color:'#9ca3af', fontSize:14 }}>{candidates.length===0?'👋 No candidates yet. Upload a CSV to begin.':'🔍 No candidates match your filters.'}</td></tr>
                    ):filteredCandidates.map((c,i)=><CandidateRow key={c.id} c={c} rank={i+1}/>)}
                  </tbody>
                </table>
              </div>
            </div>
            {filteredCandidates.length>0&&<div style={{ marginTop:12, fontSize:12, color:'#9ca3af', textAlign:'right' }}>Showing {filteredCandidates.length} of {candidates.length} candidates · Click a row to expand details</div>}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab==='analytics'&&(
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:18 }}>📊 Pipeline Funnel</h3>
              {Object.entries(STATUS_CONFIG).map(([key,cfg])=>{
                const count=counts[key]||0; const pct=candidates.length?(count/candidates.length*100):0;
                return (
                  <div key={key} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{cfg.label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:cfg.color }}>{count} <span style={{ fontSize:11, color:'#9ca3af', fontWeight:400 }}>({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div style={{ height:10, background:'#f3f4f6', borderRadius:5, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:cfg.color, borderRadius:5, transition:'width 0.8s ease' }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:18 }}>🏆 Top 5 Candidates</h3>
              {candidates.slice(0,5).map((c,i)=>(
                <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <span style={{ fontSize:18, minWidth:24, textAlign:'center' }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{c.name}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{c.college}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:18, fontWeight:700, color:'#2563eb' }}>{c.total_score?.toFixed(1)}</div>
                    <StatusBadge status={c.status}/>
                  </div>
                </div>
              ))}
              {candidates.length===0&&<div style={{ textAlign:'center', color:'#9ca3af', fontSize:13, paddingTop:20 }}>Run AI evaluation to see rankings</div>}
            </div>

            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:18 }}>📈 Score Distribution</h3>
              {[
                { range:'80-100', label:'Exceptional', color:'#059669' },
                { range:'60-79', label:'Strong', color:'#2563eb' },
                { range:'40-59', label:'Average', color:'#d97706' },
                { range:'0-39', label:'Below avg', color:'#dc2626' },
              ].map(({ range, label, color })=>{
                const [min,max]=range.split('-').map(Number);
                const count=candidates.filter(c=>(c.total_score??0)>=min&&(c.total_score??0)<=max).length;
                const pct=candidates.length?(count/candidates.length*100):0;
                return (
                  <div key={range} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{range} — {label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color }}>{count}</span>
                    </div>
                    <div style={{ height:10, background:'#f3f4f6', borderRadius:5, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:5 }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RECRUITMENT INSIGHTS — replaces System Capabilities */}
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:18 }}>💡 Recruitment Insights</h3>
              {[
                { label:'Average Candidate Score', value:`${avgScore}/100`, icon:'🧠', color:'#2563eb' },
                { label:'Shortlisting Rate', value:`${shortlistRate}%`, icon:'⭐', color:'#d97706' },
                { label:'Interview Conversion Rate', value:`${interviewRate}%`, icon:'📅', color:'#059669' },
                { label:'Candidates Processed', value:candidates.filter(c=>c.ai_score).length, icon:'✅', color:'#7c3aed' },
                { label:'Candidate Quality Index', value:avgScore>='75'?'High':avgScore>='50'?'Medium':'Low', icon:'📊', color:'#059669' },
                { label:'Top Score', value:topCandidate?`${topCandidate.total_score?.toFixed(1)}/100`:'—', icon:'🏆', color:'#dc2626' },
              ].map((item,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:i<5?12:0, padding:'10px 14px', background:`${item.color}08`, borderRadius:10, border:`1px solid ${item.color}20` }}>
                  <span style={{ fontSize:20 }}>{item.icon}</span>
                  <span style={{ flex:1, fontSize:13, color:'#374151', fontWeight:500 }}>{item.label}</span>
                  <span style={{ fontSize:15, fontWeight:700, color:item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}
