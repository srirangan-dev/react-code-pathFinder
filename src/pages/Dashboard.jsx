import { useState } from 'react'
import { Link } from 'react-router-dom'


const SAVED_COLLEGES = [
  { name: 'Govt. Commerce & Management College', location: 'Ahmedabad', stream: 'Commerce', color: '#10B981', bg: '#F0FDF4' },
  { name: 'Government Science College', location: 'Jaipur', stream: 'Science', color: '#3B82F6', bg: '#EFF6FF' },
]

const ACTIVITIES = [
  { icon: '🧠', text: 'Completed Aptitude Quiz', time: '2 hours ago', color: '#F97316' },
  { icon: '🏛️', text: 'Saved Govt. Commerce College, Ahmedabad', time: 'Yesterday', color: '#10B981' },
  { icon: '📅', text: 'Set reminder for DU Admissions', time: '3 days ago', color: '#3B82F6' },
  { icon: '🗺️', text: 'Explored B.Com career path', time: '1 week ago', color: '#8B5CF6' },
]

const RECOMMENDATIONS = [
  { title: 'B.Com Honours', score: 95, college: 'Govt. College, Ahmedabad', reason: 'Matches your Commerce aptitude' },
  { title: 'BBA', score: 88, college: 'Rajkiya College, Lucknow', reason: 'Aligns with your business interest' },
  { title: 'BA Economics', score: 76, college: 'Zila Parishad College, Nagpur', reason: 'Strong analytical skills detected' },
]

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const [profileStep, setProfileStep] = useState(null)
  const [profile, setProfile] = useState({
    name: 'Student User',
    class: '12',
    stream: 'Commerce',
    state: 'Gujarat',
    quizDone: true,
  })

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ paddingTop: 68, background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Profile Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1a2f4a 100%)',
        padding: '50px 24px 36px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'white', fontSize: '1.5rem',
              border: '3px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}>{initials}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <h2 style={{
                  fontFamily: 'Sora, sans-serif', fontWeight: 800,
                  color: 'white', fontSize: '1.4rem',
                }}>{profile.name}</h2>
                <span style={{
                  padding: '3px 12px', borderRadius: 50,
                  background: 'rgba(249,115,22,0.2)', color: '#FED7AA',
                  fontSize: '0.75rem', fontFamily: 'Sora, sans-serif', fontWeight: 700,
                }}>Class {profile.class}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { label: profile.stream + ' Stream', icon: '📊' },
                  { label: profile.state, icon: '📍' },
                  { label: profile.quizDone ? 'Quiz Complete' : 'Quiz Pending', icon: '✅' },
                ].map(({ label, icon }) => (
                  <span key={label} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            <button className="btn" style={{
              background: 'rgba(255,255,255,0.1)', color: 'white',
              border: '1.5px solid rgba(255,255,255,0.2)', fontSize: '0.85rem',
            }}>
              ✏️ Edit Profile
            </button>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, color: 'white', fontSize: '0.88rem' }}>Profile Completion</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#F97316', fontSize: '0.88rem' }}>68%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '68%' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>
              Add your Class 12 marks and district to unlock better college matches
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8E0D5', position: 'sticky', top: 68, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'recommendations', label: '✨ My Recommendations' },
            { id: 'saved', label: '💾 Saved Colleges' },
            { id: 'activity', label: '📜 Activity' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '16px 20px',
              border: 'none',
              borderBottom: tab === t.id ? '2.5px solid #F97316' : '2.5px solid transparent',
              background: 'transparent',
              fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '0.85rem',
              color: tab === t.id ? '#F97316' : '#64748B',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '36px 24px' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Colleges Saved', value: '2', icon: '🏛️', color: '#3B82F6' },
                { label: 'Quizzes Taken', value: '1', icon: '🧠', color: '#F97316' },
                { label: 'Reminders Set', value: '1', icon: '🔔', color: '#10B981' },
                { label: 'Profile Score', value: '68%', icon: '⭐', color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: 24 }}>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: 18 }}>Quick Actions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { to: '/quiz', icon: '🧠', label: 'Retake Quiz', color: '#F97316', bg: '#FFF7ED' },
                  { to: '/colleges', icon: '🏛️', label: 'Find Colleges', color: '#3B82F6', bg: '#EFF6FF' },
                  { to: '/careers', icon: '🗺️', label: 'Career Map', color: '#10B981', bg: '#F0FDF4' },
                  { to: '/timeline', icon: '📅', label: 'View Deadlines', color: '#F59E0B', bg: '#FEF3C7' },
                ].map(({ to, icon, label, color, bg }) => (
                  <Link key={label} to={to} style={{
                    textDecoration: 'none', padding: '16px', borderRadius: 12,
                    background: bg, border: `1px solid ${color}22`,
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: color }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Recommendation */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBF5)', border: '1.5px solid #FED7AA' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '1.6rem' }}>✨</span>
                <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#C2410C' }}>
                  Top Recommendation for You
                </h4>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', color: '#1E293B', marginBottom: 6 }}>
                    B.Com Honours
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 10 }}>
                    Based on your Commerce aptitude results and interest in finance
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ padding: '4px 14px', borderRadius: 50, background: '#F0FDF4', color: '#10B981', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>95% Match</span>
                    <span className="tag">3 Years</span>
                    <span className="tag">₹5–25 LPA</span>
                  </div>
                </div>
                <Link to="/careers" className="btn btn-primary">View Career Path →</Link>
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {tab === 'recommendations' && (
          <div>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              Based on your aptitude quiz results and profile, here are your personalized course recommendations.
            </p>
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="card" style={{ marginBottom: 16, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: i === 0 ? '#FFF7ED' : '#F8F4EF',
                  border: i === 0 ? '2px solid #F97316' : '2px solid #E8E0D5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.1rem',
                  color: i === 0 ? '#F97316' : '#94A3B8',
                  flexShrink: 0,
                }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{rec.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 6 }}>
                    📍 {rec.college}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>💡 {rec.reason}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: `conic-gradient(#F97316 ${rec.score * 3.6}deg, #E8E0D5 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', background: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '0.9rem', color: '#F97316',
                    }}>{rec.score}%</div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>Match</div>
                </div>
                <Link to="/careers" className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '9px 18px' }}>
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* SAVED COLLEGES TAB */}
        {tab === 'saved' && (
          <div>
            {SAVED_COLLEGES.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {SAVED_COLLEGES.map((c, i) => (
                  <div key={i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 12,
                      background: c.bg, fontSize: '1.4rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid ${c.color}33`, flexShrink: 0,
                    }}>🏛️</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{c.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#64748B' }}>📍 {c.location}</p>
                    </div>
                    <span style={{
                      padding: '4px 14px', borderRadius: 50, fontSize: '0.78rem',
                      fontFamily: 'Sora, sans-serif', fontWeight: 700,
                      background: c.bg, color: c.color,
                    }}>{c.stream}</span>
                    <Link to="/colleges" className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>View</Link>
                  </div>
                ))}
                <Link to="/colleges" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  + Find More Colleges
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏛️</div>
                <h4 style={{ fontFamily: 'Sora, sans-serif', color: '#1E293B', marginBottom: 8 }}>No saved colleges yet</h4>
                <Link to="/colleges" className="btn btn-primary">Find Colleges</Link>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {tab === 'activity' && (
          <div className="card">
            <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: 20 }}>Recent Activity</h4>
            {ACTIVITIES.map((act, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'center',
                paddingBottom: i < ACTIVITIES.length - 1 ? 16 : 0,
                marginBottom: i < ACTIVITIES.length - 1 ? 16 : 0,
                borderBottom: i < ACTIVITIES.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `${act.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                }}>{act.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#334155' }}>{act.text}</p>
                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 2 }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}