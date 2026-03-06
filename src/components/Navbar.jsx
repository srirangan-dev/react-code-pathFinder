import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Take Quiz',  to: '/quiz' },
  { label: 'Career Map', to: '/careers' },
  { label: 'Colleges',   to: '/colleges' },
  { label: 'Timeline',   to: '/timeline' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isLight = pathname !== '/' || scrolled

  const handleLogout = () => {
    logout()
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,251,245,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid #E8E0D5' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1180, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68,
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #F97316, #F59E0B)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'white', fontSize: '1rem',
          }}>P</div>
          <span style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.1rem',
            color: isLight ? '#0F172A' : 'white',
            letterSpacing: '-0.02em',
          }}>PathFinder</span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={to} to={to} style={{
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 50,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: pathname === to ? '#F97316' : isLight ? '#334155' : 'rgba(255,255,255,0.85)',
              background: pathname === to ? 'rgba(249,115,22,0.08)' : 'transparent',
              transition: 'all 0.2s ease',
            }}>{label}</Link>
          ))}

          {/* ── Logged OUT: Login + Sign Up ── */}
          {!user && (
            <>
              <Link to="/login" style={{
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 50,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isLight ? '#F97316' : 'white',
                border: isLight ? '1.5px solid #F97316' : '1.5px solid rgba(255,255,255,0.6)',
                background: 'transparent',
                transition: 'all 0.2s ease',
                marginLeft: 8,
              }}>Login</Link>

              <Link to="/signup" style={{
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 50,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'white',
                background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                boxShadow: '0 3px 12px rgba(249,115,22,0.35)',
                transition: 'all 0.2s ease',
              }}>Sign Up</Link>
            </>
          )}

          {/* ── Logged IN: Avatar + Name + Logout ── */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 14px 5px 5px', borderRadius: 50,
                background: isLight ? '#FFF4ED' : 'rgba(255,255,255,0.15)',
                border: isLight ? '1.5px solid #FED7AA' : '1.5px solid rgba(255,255,255,0.3)',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: 'white',
                }}>{initials}</div>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                  color: isLight ? '#1E293B' : 'white',
                }}>{user.name.split(' ')[0]}</span>
              </div>

              <button onClick={handleLogout} style={{
                padding: '8px 16px', borderRadius: 50, border: 'none',
                background: 'transparent',
                color: isLight ? '#EF4444' : 'rgba(255,255,255,0.8)',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>Logout</button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" aria-label="Menu"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 2, background: isLight ? '#0F172A' : 'white', borderRadius: 2 }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'white', border: '1px solid #E8E0D5', borderRadius: 14,
          margin: '0 0 16px', padding: '12px 8px',
          display: 'flex', flexDirection: 'column', gap: 2,
          boxShadow: '0 10px 40px rgba(15,23,42,0.14)',
        }}>
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={to} to={to} style={{
              textDecoration: 'none', padding: '10px 16px', borderRadius: 8,
              fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.95rem',
              color: pathname === to ? '#F97316' : '#334155',
              background: pathname === to ? 'rgba(249,115,22,0.08)' : 'transparent',
            }}>{label}</Link>
          ))}

          <div style={{ height: 1, background: '#E8E0D5', margin: '4px 8px' }} />

          {/* Mobile Logged OUT */}
          {!user && (
            <div style={{ display: 'flex', gap: 8, padding: '6px 8px 4px' }}>
              <Link to="/login" style={{
                flex: 1, textAlign: 'center', textDecoration: 'none',
                padding: '10px 0', borderRadius: 50,
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                color: '#F97316', border: '1.5px solid #F97316', background: 'transparent',
              }}>Login</Link>
              <Link to="/signup" style={{
                flex: 1, textAlign: 'center', textDecoration: 'none',
                padding: '10px 0', borderRadius: 50,
                fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                color: 'white', background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                boxShadow: '0 3px 12px rgba(249,115,22,0.35)',
              }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile Logged IN */}
          {user && (
            <div style={{ padding: '6px 8px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: '#FFF4ED', border: '1px solid #FED7AA',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: 'white',
                }}>{initials}</div>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>{user.name}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#94A3B8' }}>{user.stream}</div>
                </div>
              </div>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 16px', borderRadius: 8, textAlign: 'left',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.95rem', color: '#EF4444',
              }}>🚪 Logout</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex   !important; }
        }
      `}</style>
    </nav>
  )
}