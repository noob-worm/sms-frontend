import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  tabName: string;
  userName: string;
}

const iconBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 4px #0001",
  transition: "background 0.2s",
  padding: 0,
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  background: "#fff",
  color: "#222",
  minWidth: 170,
  boxShadow: "0 4px 18px #0003",
  borderRadius: 10,
  marginTop: 8,
  zIndex: 200,
  padding: "0.5rem 0.2rem",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontSize: 18,
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.3)",
  zIndex: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBox: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: "2rem 2.5rem",
  boxShadow: "0 2px 16px #0002",
  minWidth: 320,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const Header: React.FC<HeaderProps> = ({ tabName, userName }) => {
  const [showModule, setShowModule] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [lockError, setLockError] = useState("");
  const router = useRouter();

  // Dummy password for lock (replace with real auth logic)
  const correctPassword = "admin123";

  const handleLock = () => {
    if (lockPassword === correctPassword) {
      setShowLock(false);
      setLockPassword("");
      setLockError("");
      // Unlock logic here
    } else {
      setLockError("Incorrect password");
    }
  };

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "99vw",
      zIndex: 100,
      background: "#097987ff",
      boxShadow: "0 2px 8px #0001",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.1rem 1.5rem 0.1rem 1rem",
      minHeight: 60,
    }}>
      {/* Left: Home Icon */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button style={iconBtn} onClick={() => router.push("/main")}
          aria-label="Home">
          {/* Home SVG */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 11.5L12 4l9 7.5" stroke="#fff" strokeWidth="2"/><rect x="6" y="12" width="12" height="8" rx="2" fill="#fff" stroke="#097987" strokeWidth="1.5"/></svg>
        </button>
        {/* Module Tab */}
        <div style={{ position: "relative" }}>
          <button style={{ ...iconBtn, background: showModule ? "#e0f7fa" : "none", color: showModule ? "#097987" : "#fff", fontWeight: 700, fontSize: 18, borderRadius: 8, width: "auto", padding: "0.5rem 1.2rem" }}
            onClick={() => setShowModule(v => !v)}>
            Module
            <span style={{ fontSize: 11, marginLeft: 6, color: "#888", transform: showModule ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
          </button>
          {showModule && (
            <div style={dropdownStyle}>
              <div style={{ padding: "0.7rem 1.1rem", cursor: "pointer", borderRadius: 6, fontWeight: 500, background: "#f5f5f5", margin: "0 8px", border: "1px solid #e0e0e0", boxShadow: "0 1px 4px #0001", fontSize: 15 }}
                onClick={() => { 
                  setShowModule(false); 
                  router.push("/add_student"); 
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#d1eaff')}
                onMouseOut={e => (e.currentTarget.style.background = '#f5f5f5')}
              >Master</div>
              <div style={{ padding: "0.7rem 1.1rem", cursor: "pointer", borderRadius: 6, fontWeight: 500, background: "#e8f5e9", margin: "0 8px", border: "1px solid #c8e6c9", boxShadow: "0 1px 4px #0001", color: "#1b5e20", fontSize: 15 }}
                onClick={() => { setShowModule(false); /* TODO: router.push('/library') */ }}
                onMouseOver={e => (e.currentTarget.style.background = '#b9f6ca')}
                onMouseOut={e => (e.currentTarget.style.background = '#e8f5e9')}
              >Library Management System</div>
            </div>
          )}
        </div>
        {/* Tab Name */}
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 20, marginLeft: 18 }}>{tabName}</span>
      </div>
      {/* Right: Lock, Search, Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* Lock Icon */}
        <button style={iconBtn} onClick={() => setShowLock(true)} aria-label="Lock">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="8" rx="2" fill="#fff" stroke="#097987" strokeWidth="1.5"/><path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="#fff" strokeWidth="2"/></svg>
        </button>
        {/* Search Icon */}
        <button style={iconBtn} aria-label="Search" onClick={() => alert('Search coming soon!')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#fff" strokeWidth="2"/></svg>
        </button>
        {/* Profile Icon */}
        <div style={{ position: "relative" }}>
          <button style={iconBtn} onClick={() => setShowProfile(v => !v)} aria-label="Profile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4.2" stroke="#232323" strokeWidth="1.7" fill="#f5f5f5" /><path d="M4.5 19.2c0-3.1 3.1-5.2 7.5-5.2s7.5 2.1 7.5 5.2" stroke="#232323" strokeWidth="1.7" fill="#f5f5f5" /></svg>
          </button>
          {showProfile && (
            <div style={{ ...dropdownStyle, right: 0, left: "auto", minWidth: 160 }}>
              <div style={{ padding: '0.6rem 1.1rem', borderRadius: 6, background: '#f5f5f5', fontWeight: 600, marginBottom: 2, minWidth: 90 }}>Profile</div>
              <div style={{ padding: '0.6rem 1.1rem', borderRadius: 6, background: '#e3f2fd', color: '#222', fontWeight: 500, minWidth: 90 }}>{userName}</div>
              <div style={{ padding: '0.6rem 1.1rem', borderRadius: 6, background: '#ffeaea', color: '#d32f2f', fontWeight: 500, cursor: 'pointer', minWidth: 90 }}
                onClick={() => { localStorage.removeItem('user'); setShowProfile(false); router.push('/login'); }}
              >Log Out</div>
            </div>
          )}
        </div>
      </div>
      {/* Lock Modal */}
      {showLock && (
        <div style={modalOverlay} onClick={() => setShowLock(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 18 }}>Unlock</h3>
            <input
              type="password"
              placeholder="Enter password"
              value={lockPassword}
              onChange={e => { setLockPassword(e.target.value); setLockError(""); }}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid #ccc', width: '80%', marginBottom: 12 }}
            />
            {lockError && <div style={{ color: 'red', marginBottom: 8 }}>{lockError}</div>}
            <button onClick={handleLock} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, background: '#097987', color: '#fff', fontWeight: 600, border: 'none', marginTop: 6 }}>Unlock</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 