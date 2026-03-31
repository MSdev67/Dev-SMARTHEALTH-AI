'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { ArrowBack, AccountCircle } from '@mui/icons-material';
import { Email, Phone, Person } from '@mui/icons-material';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const fields = [
    {
      icon: <Person sx={{ color: '#0d9e72', fontSize: 20 }} />,
      label: 'FULL NAME',
      value: user?.name || '—',
    },
    {
      icon: <Email sx={{ color: '#0d9e72', fontSize: 20 }} />,
      label: 'EMAIL ADDRESS',
      value: user?.email || '—',
    },
    {
      icon: <Phone sx={{ color: '#0d9e72', fontSize: 20 }} />,
      label: 'PHONE NUMBER',
      value: user?.phone || 'Not provided',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        bgcolor: '#f0faf7',
        overflow: 'hidden',
      }}
    >
      {/* ── Left Panel ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: '#ffffff',
          overflow: 'hidden',
          px: 6,
          py: 6,
        }}
      >
        {/* Background decorative circle */}
        <Box
          sx={{
            position: 'absolute',
            right: -120,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e0f7f0 0%, #b2edd8 60%, #6dcfad 100%)',
            zIndex: 0,
          }}
        />

        {/* Decorative dots */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 8, height: 8,
              borderRadius: '50%',
              bgcolor: '#38c89a',
              opacity: 0.5,
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              zIndex: 0,
            }}
          />
        ))}

        {/* Wavy line */}
        <Box sx={{ position: 'absolute', bottom: 80, left: 40, zIndex: 0, opacity: 0.15 }}>
          <svg width="200" height="60" viewBox="0 0 200 60">
            <path
              d="M0 30 Q25 0 50 30 Q75 60 100 30 Q125 0 150 30 Q175 60 200 30"
              stroke="#0d9e72" strokeWidth="3" fill="none"
            />
          </svg>
        </Box>

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '10px', bgcolor: '#0d9e72',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 13h-2v-2H9v-2h2V9h2v2h2v2h-2v2z" fill="white" />
              </svg>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#0d9e72', letterSpacing: '-0.3px' }}>
              SmartHealth AI
            </Typography>
          </Box>
        </Box>

        {/* Hero text */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
          <Typography
            sx={{
              fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.2,
              color: '#0a2e24', mb: 2, letterSpacing: '-1px',
            }}
          >
            Your{' '}
            <Box component="span" sx={{ color: '#0d9e72' }}>Health</Box>{' '}
            Profile
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: '#5a7a70', lineHeight: 1.7, mb: 4 }}>
            All your personal details in one place — secure, private, and always up to date.
          </Typography>

          {/* Quote block */}
          <Box sx={{ mt: 1, pl: 2.5, borderLeft: '3px solid #0d9e72', position: 'relative' }}>
            <Typography
              sx={{
                position: 'absolute', top: -18, left: 8,
                fontSize: '4rem', lineHeight: 1, color: '#0d9e72',
                opacity: 0.18, fontFamily: 'Georgia, serif', userSelect: 'none',
              }}
            >
              "
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem', fontStyle: 'italic', color: '#2d5a4a',
                lineHeight: 1.75, fontWeight: 500, letterSpacing: '0.1px',
              }}
            >
              Your health story is unique. Own it, understand it, and let AI help you write a better chapter every day.
            </Typography>
            <Typography
              sx={{
                mt: 1.2, fontSize: '0.75rem', fontWeight: 700,
                color: '#0d9e72', letterSpacing: '1px', textTransform: 'uppercase',
              }}
            >
              — SmartHealth AI
            </Typography>
          </Box>
        </Box>

        {/* Doctor illustration */}
        <Box sx={{ position: 'absolute', bottom: 0, right: 40, zIndex: 1, display: 'flex', alignItems: 'flex-end' }}>
          <svg width="220" height="300" viewBox="0 0 220 300" fill="none">
            <ellipse cx="110" cy="280" rx="55" ry="20" fill="#d4f0e5" />
            <rect x="70" y="160" width="80" height="130" rx="20" fill="#ffffff" stroke="#0d9e72" strokeWidth="2" />
            <rect x="105" y="175" width="10" height="30" rx="3" fill="#0d9e72" />
            <rect x="96" y="184" width="28" height="10" rx="3" fill="#0d9e72" />
            <circle cx="110" cy="130" r="38" fill="#ffe0c8" />
            <ellipse cx="110" cy="100" rx="38" ry="18" fill="#5a3a1a" />
            <circle cx="97" cy="130" r="4" fill="#fff" />
            <circle cx="123" cy="130" r="4" fill="#fff" />
            <circle cx="98" cy="131" r="2" fill="#333" />
            <circle cx="124" cy="131" r="2" fill="#333" />
            <path d="M100 145 Q110 155 120 145" stroke="#c0764a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <rect x="30" y="165" width="42" height="14" rx="7" fill="#ffffff" stroke="#0d9e72" strokeWidth="2" transform="rotate(20 30 165)" />
            <rect x="148" y="165" width="42" height="14" rx="7" fill="#ffffff" stroke="#0d9e72" strokeWidth="2" transform="rotate(-20 190 165)" />
            <path d="M85 195 Q75 215 85 225 Q95 235 105 220" stroke="#888" strokeWidth="2.5" fill="none" />
            <circle cx="105" cy="218" r="6" fill="#555" />
          </svg>
        </Box>
      </Box>

      {/* ── Right Panel ── */}
      <Box
        sx={{
          width: { xs: '100%', md: '460px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 5 },
          py: 5,
          bgcolor: '#f0faf7',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* Top-right back button */}
        <Box sx={{ position: 'absolute', top: 28, right: 28 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
            onClick={() => router.push('/')}
            sx={{
              borderColor: '#0d9e72', color: '#0d9e72', borderRadius: '20px',
              textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 2,
              '&:hover': { bgcolor: '#e6f9f2', borderColor: '#0b8860' },
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Avatar + greeting */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, mt: 6 }}>
          <Box
            sx={{
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: '#0d9e72',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(13,158,114,0.3)',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '1.9rem', fontWeight: 800, color: '#0a2e24',
                letterSpacing: '-0.5px', lineHeight: 1.1,
              }}
            >
              {user?.name || 'Your Profile'}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#7a9e94', mt: 0.3 }}>
              SmartHealth AI Member
            </Typography>
          </Box>
        </Box>

        {/* Profile fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {fields.map((field) => (
            <Box
              key={field.label}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #cce8de',
                px: 2.5,
                py: 1.8,
                display: 'flex',
                alignItems: 'center',
                gap: 1.8,
              }}
            >
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: '9px',
                  bgcolor: '#e0f7ef',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {field.icon}
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#7a9e94', letterSpacing: '0.8px', mb: 0.2 }}
                >
                  {field.label}
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#0a2e24' }}>
                  {field.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Feature pills */}
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['🔒 Secure & Private', '🤖 AI-Powered', '📊 Health Tracking'].map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 2, py: 0.7,
                bgcolor: '#e0f7ef',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#0d7a58',
                fontWeight: 600,
                border: '1px solid #b2e8d4',
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>

        {/* Notice */}
        <Box
          sx={{
            mt: 3, p: 1.8,
            bgcolor: '#ffffff',
            borderRadius: 2,
            border: '1px dashed #b2e8d4',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            💡 <strong>Coming Soon:</strong> Full profile editing will be available after backend deployment.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}