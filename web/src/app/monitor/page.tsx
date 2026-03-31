'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Simulated live data generators ───────────────────────────────────────────
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const createVitalStream = (base, variance, min, max) => {
  let current = base;
  return () => {
    current = clamp(current + (Math.random() - 0.5) * variance, min, max);
    return Math.round(current * 10) / 10;
  };
};

const heartRateGen  = createVitalStream(72, 4, 55, 105);
const spo2Gen       = createVitalStream(98, 0.8, 94, 100);
const bpSysGen      = createVitalStream(120, 5, 100, 150);
const bpDiaGen      = createVitalStream(80, 3, 60, 100);
const tempGen       = createVitalStream(37.1, 0.15, 36.1, 38.5);
const respGen       = createVitalStream(16, 1.5, 10, 24);
const glucoseGen    = createVitalStream(95, 4, 70, 130);
const stressGen     = createVitalStream(42, 6, 10, 90);

// ECG-like waveform generator
const generateECGPoint = (() => {
  let phase = 0;
  return () => {
    phase = (phase + 1) % 100;
    if (phase < 10)  return 0;
    if (phase < 15)  return -5;
    if (phase < 20)  return 8;
    if (phase < 22)  return 90;
    if (phase < 25)  return -20;
    if (phase < 30)  return 5;
    if (phase < 40)  return 15;
    if (phase < 50)  return 12;
    if (phase < 60)  return 0;
    return 0;
  };
})();

// ─── Color helpers ────────────────────────────────────────────────────────────
const getStatusColor = (val, ranges) => {
  if (val < ranges.low || val > ranges.high) return { color: '#ef4444', label: 'Critical', bg: '#fef2f2', border: '#fecaca' };
  if (val < ranges.warnLow || val > ranges.warnHigh) return { color: '#f59e0b', label: 'Warning', bg: '#fffbeb', border: '#fde68a' };
  return { color: '#10b981', label: 'Normal', bg: '#ecfdf5', border: '#a7f3d0' };
};

// ─── Mini SVG sparkline chart ─────────────────────────────────────────────────
const Sparkline = ({ data, color, height = 40, width = 120 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* last point dot */}
      {data.length > 0 && (
        <circle
          cx={(( data.length - 1) / (data.length - 1)) * width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="3" fill={color}
        />
      )}
    </svg>
  );
};

// ─── ECG Strip ────────────────────────────────────────────────────────────────
const ECGStrip = ({ data, isLive }) => {
  const width = 600;
  const height = 80;
  const midY = height / 2;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = midY - (v / 100) * (height * 0.45);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative', background: '#0a0f1e', borderRadius: 16, overflow: 'hidden', padding: '8px 0' }}>
      {/* Grid lines */}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        {/* Horizontal grid */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1="0" y1={f * height} x2={width} y2={f * height} stroke="#1e3a5f" strokeWidth="0.5" />
        ))}
        {/* Vertical grid */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={(i / 11) * width} y1="0" x2={(i / 11) * width} y2={height} stroke="#1e3a5f" strokeWidth="0.5" />
        ))}
        {/* Baseline */}
        <line x1="0" y1={midY} x2={width} y2={midY} stroke="#1e3a5f" strokeWidth="1" />
        {/* ECG line */}
        {data.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke={isLive ? '#00ff88' : '#3b82f6'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 4px ${isLive ? '#00ff88' : '#3b82f6'})` }}
          />
        )}
      </svg>
      {/* Scan line */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          width: 2, background: 'rgba(0,255,136,0.3)',
          right: 0, boxShadow: '0 0 8px rgba(0,255,136,0.5)',
        }} />
      )}
    </div>
  );
};

// ─── Radial gauge ─────────────────────────────────────────────────────────────
const RadialGauge = ({ value, min, max, color, size = 100 }) => {
  const pct = (value - min) / (max - min);
  const angle = pct * 240 - 120;
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const startAngle = -210;
  const endAngle = startAngle + pct * 240;
  const toRad = deg => (deg * Math.PI) / 180;
  const arc = (deg) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });
  const s = arc(startAngle);
  const e = arc(endAngle);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`gauge-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * r * (240 / 360)} ${2 * Math.PI * r}`}
        transform={`rotate(-210 ${cx} ${cy})`}
      />
      {/* Progress */}
      {pct > 0.01 && (
        <path
          d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`}
          fill="none"
          stroke={`url(#gauge-${color.replace('#','')})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
      {/* Needle dot */}
      <circle cx={e.x} cy={e.y} r="4" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
};

// ─── Vital Card ───────────────────────────────────────────────────────────────
const VitalCard = ({ icon, label, value, unit, history, status, trend, sublabel }) => {
  const isUp = trend > 0;
  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: '20px 24px',
      border: `1.5px solid ${status.border}`,
      boxShadow: `0 4px 20px ${status.color}10`,
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      {/* Status glow corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${status.color}15, transparent 70%)`,
        borderRadius: '0 20px 0 0',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: status.bg, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>{icon}</div>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
            {sublabel && <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 1 }}>{sublabel}</div>}
          </div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, color: status.color,
          background: status.bg, border: `1px solid ${status.border}`,
          borderRadius: 8, padding: '3px 8px',
        }}>{status.label}</div>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: -1 }}>{value}</span>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{unit}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 12, fontWeight: 700,
          color: isUp ? '#ef4444' : '#10b981',
        }}>
          {isUp ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}
        </span>
      </div>

      {/* Sparkline */}
      <Sparkline data={history} color={status.color} height={38} width={200} />
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HealthMonitor() {
  const [isLive, setIsLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1H');

  // Vital histories
  const [hrHistory,   setHrHistory]   = useState(() => Array.from({length: 60}, heartRateGen));
  const [spo2History, setSpo2History] = useState(() => Array.from({length: 60}, spo2Gen));
  const [bpSHistory,  setBpSHistory]  = useState(() => Array.from({length: 60}, bpSysGen));
  const [bpDHistory,  setBpDHistory]  = useState(() => Array.from({length: 60}, bpDiaGen));
  const [tempHistory, setTempHistory] = useState(() => Array.from({length: 60}, tempGen));
  const [respHistory, setRespHistory] = useState(() => Array.from({length: 60}, respGen));
  const [glucHistory, setGlucHistory] = useState(() => Array.from({length: 60}, glucoseGen));
  const [stressHist,  setStressHist]  = useState(() => Array.from({length: 60}, stressGen));
  const [ecgData,     setEcgData]     = useState(() => Array.from({length: 100}, generateECGPoint));

  // Current values
  const hr     = hrHistory[hrHistory.length - 1];
  const spo2   = spo2History[spo2History.length - 1];
  const bpSys  = bpSHistory[bpSHistory.length - 1];
  const bpDia  = bpDHistory[bpDHistory.length - 1];
  const temp   = tempHistory[tempHistory.length - 1];
  const resp   = respHistory[respHistory.length - 1];
  const glucose = glucHistory[glucHistory.length - 1];
  const stress  = stressHist[stressHist.length - 1];

  // Tick every second
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setTick(t => t + 1);
      const newHr = heartRateGen();
      const newSpo2 = spo2Gen();
      setHrHistory(h   => [...h.slice(-99), newHr]);
      setSpo2History(h => [...h.slice(-99), newSpo2]);
      setBpSHistory(h  => [...h.slice(-99), bpSysGen()]);
      setBpDHistory(h  => [...h.slice(-99), bpDiaGen()]);
      setTempHistory(h => [...h.slice(-99), tempGen()]);
      setRespHistory(h => [...h.slice(-99), respGen()]);
      setGlucHistory(h => [...h.slice(-99), glucoseGen()]);
      setStressHist(h  => [...h.slice(-99), stressGen()]);
      setEcgData(d     => [...d.slice(-99), generateECGPoint()]);

      // Alert logic
      if (newHr > 100) {
        setAlertMsg(`⚠️ Heart rate elevated: ${Math.round(newHr)} bpm`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      }
      if (newSpo2 < 95) {
        setAlertMsg(`🚨 SpO₂ low: ${newSpo2.toFixed(1)}% — Check sensor`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isLive]);

  // Status evaluators
  const hrStatus   = getStatusColor(hr, { low: 50, high: 110, warnLow: 60, warnHigh: 100 });
  const spo2Status = getStatusColor(spo2, { low: 90, high: 101, warnLow: 95, warnHigh: 101 });
  const bpStatus   = getStatusColor(bpSys, { low: 90, high: 160, warnLow: 110, warnHigh: 140 });
  const tempStatus = getStatusColor(temp, { low: 35, high: 39, warnLow: 36, warnHigh: 37.5 });
  const respStatus = getStatusColor(resp, { low: 8, high: 25, warnLow: 12, warnHigh: 20 });
  const glucStatus = getStatusColor(glucose, { low: 60, high: 140, warnLow: 70, warnHigh: 125 });

  const overallScore = Math.round(
    ([hrStatus, spo2Status, bpStatus, tempStatus, respStatus, glucStatus]
      .filter(s => s.label === 'Normal').length / 6) * 100
  );

  const tabs = ['overview', 'cardiac', 'metabolic', 'trends'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
      fontFamily: '"Nunito", "Plus Jakarta Sans", system-ui, sans-serif',
    }}>

      {/* ── Alert Banner ── */}
      {showAlert && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
          color: 'white', borderRadius: 16, padding: '14px 24px',
          fontSize: 14, fontWeight: 700, boxShadow: '0 8px 30px rgba(239,68,68,0.4)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideIn 0.3s ease',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%', background: '#fca5a5',
            animation: 'blink 1s infinite',
          }} />
          {alertMsg}
          <button onClick={() => setShowAlert(false)} style={{
            marginLeft: 8, background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16,
          }}>×</button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(16,185,129,0.5)} 70%{box-shadow:0 0 0 10px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
        @keyframes beat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        button { cursor: pointer; font-family: inherit; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(90deg, #0f1f5c 0%, #1d3a8a 60%, #1e40af 100%)',
        padding: '0 32px',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 20px rgba(15,31,92,0.3)',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 70,
        }}>
          {/* Logo + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 15px rgba(239,68,68,0.4)',
            }}>📊</div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>Health Monitor</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Real-time Vitals Tracking</div>
            </div>
          </div>

          {/* Center: Live indicator + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Live toggle */}
            <button
              onClick={() => setIsLive(l => !l)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: isLive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${isLive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 10, padding: '8px 16px',
                color: isLive ? '#4ade80' : '#fca5a5',
                fontWeight: 700, fontSize: 13,
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isLive ? '#4ade80' : '#fca5a5',
                animation: isLive ? 'blink 1.5s infinite' : 'none',
              }} />
              {isLive ? 'LIVE' : 'PAUSED'}
            </button>

            {/* Time range */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              {['5M', '15M', '1H', '6H', '24H'].map(r => (
                <button key={r} onClick={() => setTimeRange(r)} style={{
                  padding: '6px 12px', fontSize: 12, fontWeight: 700,
                  background: timeRange === r ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: timeRange === r ? 'white' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                }}>{r}</button>
              ))}
            </div>
          </div>

          {/* Right: Patient info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Rahul Sharma</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>ID: SH-2024-00821</div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 16,
            }}>R</div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── Top summary row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24,
        }}>
          {/* Overall Health Score */}
          <div style={{
            background: 'linear-gradient(135deg, #0f1f5c, #1d3a8a)',
            borderRadius: 24, padding: '24px 28px',
            display: 'flex', alignItems: 'center', gap: 20,
            gridColumn: 'span 1',
          }}>
            <div style={{ position: 'relative' }}>
              <RadialGauge value={overallScore} min={0} max={100} color="#4ade80" size={90} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{overallScore}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 0.5 }}>SCORE</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Health Score</div>
              <div style={{ color: '#4ade80', fontWeight: 800, fontSize: 18 }}>
                {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Fair'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 }}>All vitals monitored</div>
            </div>
          </div>

          {/* Heart rate hero card */}
          <div style={{
            background: 'white', borderRadius: 24, padding: '20px 24px',
            border: `1.5px solid ${hrStatus.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: `0 4px 20px ${hrStatus.color}15`,
          }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Heart Rate</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: -2, animation: isLive ? 'beat 1s infinite' : 'none', display: 'inline-block' }}>{Math.round(hr)}</span>
                <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: 14 }}>bpm</span>
              </div>
              <div style={{ color: hrStatus.color, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{hrStatus.label}</div>
            </div>
            <div style={{ fontSize: 36, animation: isLive ? 'beat 1s ease infinite' : 'none' }}>❤️</div>
          </div>

          {/* SpO2 */}
          <div style={{
            background: 'white', borderRadius: 24, padding: '20px 24px',
            border: `1.5px solid ${spo2Status.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: `0 4px 20px ${spo2Status.color}15`,
          }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>SpO₂</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: -2 }}>{spo2.toFixed(1)}</span>
                <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: 14 }}>%</span>
              </div>
              <div style={{ color: spo2Status.color, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{spo2Status.label}</div>
            </div>
            <div style={{ fontSize: 36 }}>🫁</div>
          </div>

          {/* Blood Pressure */}
          <div style={{
            background: 'white', borderRadius: 24, padding: '20px 24px',
            border: `1.5px solid ${bpStatus.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: `0 4px 20px ${bpStatus.color}15`,
          }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Blood Pressure</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{Math.round(bpSys)}</span>
                <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: 18 }}>/</span>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#64748b', lineHeight: 1 }}>{Math.round(bpDia)}</span>
                <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: 12 }}>mmHg</span>
              </div>
              <div style={{ color: bpStatus.color, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{bpStatus.label}</div>
            </div>
            <div style={{ fontSize: 36 }}>🩺</div>
          </div>
        </div>

        {/* ── ECG Section ── */}
        <div style={{
          background: '#0a0f1e',
          borderRadius: 24,
          padding: '24px 28px',
          marginBottom: 24,
          border: '1px solid #1e293b',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(0,255,136,0.1)',
                border: '1px solid rgba(0,255,136,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>〰️</div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>ECG Strip</div>
                <div style={{ color: '#4b5563', fontSize: 12 }}>12-lead equivalent • {isLive ? 'Recording' : 'Paused'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ color: '#4b5563', fontSize: 12, background: '#111827', borderRadius: 8, padding: '4px 10px', border: '1px solid #1f2937' }}>
                25 mm/s
              </div>
              <div style={{ color: '#4b5563', fontSize: 12, background: '#111827', borderRadius: 8, padding: '4px 10px', border: '1px solid #1f2937' }}>
                10 mm/mV
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700,
                background: isLive ? 'rgba(0,255,136,0.1)' : 'rgba(239,68,68,0.1)',
                color: isLive ? '#00ff88' : '#ef4444',
                border: `1px solid ${isLive ? 'rgba(0,255,136,0.2)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: 8, padding: '4px 10px',
              }}>
                {isLive ? '● REC' : '■ STOP'}
              </div>
            </div>
          </div>
          <ECGStrip data={ecgData} isLive={isLive} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, color: '#374151', fontSize: 11 }}>
            {['I', 'II', 'III', 'aVR', 'aVL', 'aVF'].map(l => (
              <span key={l} style={{ background: '#0d1117', padding: '2px 6px', borderRadius: 4, border: '1px solid #1f2937' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', borderRadius: 16, padding: 6, border: '1px solid #e2e8f0', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '9px 22px', borderRadius: 12, fontWeight: 700,
              fontSize: 13, textTransform: 'capitalize', border: 'none',
              background: activeTab === tab ? 'linear-gradient(135deg, #1d4ed8, #1e40af)' : 'transparent',
              color: activeTab === tab ? 'white' : '#64748b',
              boxShadow: activeTab === tab ? '0 4px 12px rgba(29,78,216,0.3)' : 'none',
              transition: 'all 0.2s',
            }}>{tab}</button>
          ))}
        </div>

        {/* ── Vitals Grid ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
            <VitalCard
              icon="🌡️" label="Body Temperature" sublabel="Core temperature"
              value={temp.toFixed(1)} unit="°C"
              history={tempHistory.slice(-30)}
              status={tempStatus}
              trend={temp - tempHistory[tempHistory.length - 6]}
            />
            <VitalCard
              icon="🫀" label="Respiratory Rate" sublabel="Breaths per minute"
              value={Math.round(resp)} unit="br/min"
              history={respHistory.slice(-30)}
              status={respStatus}
              trend={resp - respHistory[respHistory.length - 6]}
            />
            <VitalCard
              icon="🩸" label="Blood Glucose" sublabel="Fasting equivalent"
              value={Math.round(glucose)} unit="mg/dL"
              history={glucHistory.slice(-30)}
              status={glucStatus}
              trend={glucose - glucHistory[glucHistory.length - 6]}
            />
          </div>
        )}

        {activeTab === 'cardiac' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
            <VitalCard
              icon="❤️" label="Heart Rate" sublabel="RR interval avg"
              value={Math.round(hr)} unit="bpm"
              history={hrHistory.slice(-30)}
              status={hrStatus}
              trend={hr - hrHistory[hrHistory.length - 6]}
            />
            <VitalCard
              icon="🩺" label="Blood Pressure (Sys)" sublabel="Systolic pressure"
              value={Math.round(bpSys)} unit="mmHg"
              history={bpSHistory.slice(-30)}
              status={bpStatus}
              trend={bpSys - bpSHistory[bpSHistory.length - 6]}
            />
            <VitalCard
              icon="💙" label="Blood Pressure (Dia)" sublabel="Diastolic pressure"
              value={Math.round(bpDia)} unit="mmHg"
              history={bpDHistory.slice(-30)}
              status={getStatusColor(bpDia, { low: 50, high: 110, warnLow: 60, warnHigh: 90 })}
              trend={bpDia - bpDHistory[bpDHistory.length - 6]}
            />
            <VitalCard
              icon="🫁" label="SpO₂" sublabel="Peripheral oxygen saturation"
              value={spo2.toFixed(1)} unit="%"
              history={spo2History.slice(-30)}
              status={spo2Status}
              trend={spo2 - spo2History[spo2History.length - 6]}
            />
          </div>
        )}

        {activeTab === 'metabolic' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
            <VitalCard
              icon="🌡️" label="Body Temperature" sublabel="Tympanic reading"
              value={temp.toFixed(1)} unit="°C"
              history={tempHistory.slice(-30)}
              status={tempStatus}
              trend={temp - tempHistory[tempHistory.length - 6]}
            />
            <VitalCard
              icon="🩸" label="Blood Glucose" sublabel="Continuous monitoring"
              value={Math.round(glucose)} unit="mg/dL"
              history={glucHistory.slice(-30)}
              status={glucStatus}
              trend={glucose - glucHistory[glucHistory.length - 6]}
            />
            <VitalCard
              icon="🧠" label="Stress Index" sublabel="HRV-based estimation"
              value={Math.round(stress)} unit="%"
              history={stressHist.slice(-30)}
              status={getStatusColor(stress, { low: 0, high: 100, warnLow: 0, warnHigh: 70 })}
              trend={stress - stressHist[stressHist.length - 6]}
            />
          </div>
        )}

        {activeTab === 'trends' && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px', border: '1.5px solid #e2e8f0', marginBottom: 24 }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 18, marginBottom: 6 }}>24-Hour Trend Analysis</div>
            <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Historical vitals overview — {timeRange} window</div>
            {[
              { label: 'Heart Rate', unit: 'bpm', history: hrHistory, color: '#ef4444', normal: '60–100' },
              { label: 'SpO₂', unit: '%', history: spo2History, color: '#3b82f6', normal: '>95' },
              { label: 'Systolic BP', unit: 'mmHg', history: bpSHistory, color: '#8b5cf6', normal: '90–140' },
              { label: 'Temperature', unit: '°C', history: tempHistory, color: '#f59e0b', normal: '36–37.5' },
            ].map((v, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '16px 0',
                borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
              }}>
                <div style={{ width: 140, flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{v.label}</div>
                  <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Normal: {v.normal} {v.unit}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Sparkline data={v.history} color={v.color} height={50} width={500} />
                </div>
                <div style={{ width: 80, textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 20 }}>
                    {typeof v.history[v.history.length - 1] === 'number'
                      ? v.label === 'Temperature' || v.label === 'SpO₂'
                        ? v.history[v.history.length - 1].toFixed(1)
                        : Math.round(v.history[v.history.length - 1])
                      : '—'}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>{v.unit}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom row: stress + activity + alerts ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

          {/* Stress meter */}
          <div style={{
            background: 'white', borderRadius: 24, padding: '24px',
            border: '1.5px solid #e2e8f0',
          }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 4 }}>🧠 Stress Index</div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 20 }}>HRV-based estimation</div>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 12 }}>
              <RadialGauge value={Math.round(stress)} min={0} max={100} color={stress > 70 ? '#ef4444' : stress > 40 ? '#f59e0b' : '#10b981'} size={120} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}>
                <span style={{ fontWeight: 900, fontSize: 26, color: '#0f172a' }}>{Math.round(stress)}</span>
                <span style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 0.5 }}>/ 100</span>
              </div>
            </div>
            <div style={{
              textAlign: 'center', fontWeight: 700, fontSize: 14,
              color: stress > 70 ? '#ef4444' : stress > 40 ? '#f59e0b' : '#10b981',
            }}>
              {stress > 70 ? '🔴 High Stress' : stress > 40 ? '🟡 Moderate' : '🟢 Relaxed'}
            </div>
          </div>

          {/* Activity ring */}
          <div style={{
            background: 'white', borderRadius: 24, padding: '24px',
            border: '1.5px solid #e2e8f0',
          }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 4 }}>🏃 Activity</div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 16 }}>Today's progress</div>
            {[
              { label: 'Steps', value: 7842, max: 10000, color: '#ef4444', emoji: '👣' },
              { label: 'Calories', value: 1240, max: 2000, color: '#f59e0b', emoji: '🔥' },
              { label: 'Active min', value: 45, max: 60, color: '#10b981', emoji: '⏱️' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{item.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                    {item.value.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: 500 }}>/ {item.max.toLocaleString()}</span>
                  </span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${item.color}aa, ${item.color})`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Alerts log */}
          <div style={{
            background: 'white', borderRadius: 24, padding: '24px',
            border: '1.5px solid #e2e8f0',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 4 }}>🔔 Alert Log</div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 16 }}>Last 24 hours</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {[
                { time: '14:32', msg: 'SpO₂ dropped to 94.1%', level: 'critical', icon: '🚨' },
                { time: '12:15', msg: 'Heart rate: 102 bpm', level: 'warning', icon: '⚠️' },
                { time: '09:44', msg: 'BP elevated: 142/91', level: 'warning', icon: '⚠️' },
                { time: '08:00', msg: 'Morning vitals — All clear', level: 'ok', icon: '✅' },
                { time: '00:30', msg: 'Night monitoring — Normal', level: 'ok', icon: '✅' },
              ].map((alert, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '10px 14px', borderRadius: 12,
                  background: alert.level === 'critical' ? '#fef2f2' : alert.level === 'warning' ? '#fffbeb' : '#f0fdf4',
                  border: `1px solid ${alert.level === 'critical' ? '#fecaca' : alert.level === 'warning' ? '#fde68a' : '#bbf7d0'}`,
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{alert.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{alert.msg}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Export bar ── */}
        <div style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #0f1f5c, #1d3a8a)',
          borderRadius: 20, padding: '18px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>📋</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Session Report</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                Monitoring since 08:00 AM · {tick} data points collected
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['📤 Share with Doctor', '📄 Export PDF', '☁️ Sync Cloud'].map((btn, i) => (
              <button key={i} style={{
                padding: '9px 18px', borderRadius: 12, fontWeight: 700, fontSize: 12,
                background: i === 0 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.08)',
                color: 'white', border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
                boxShadow: i === 0 ? '0 4px 15px rgba(239,68,68,0.35)' : 'none',
                transition: 'all 0.2s',
              }}>{btn}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}