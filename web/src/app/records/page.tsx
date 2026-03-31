'use client';

import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { ArrowBack, FolderShared } from '@mui/icons-material';

export default function RecordsPage() {
  const router = useRouter();

  const mockRecords = [
    { icon: '🩸', label: 'Blood Test', date: 'Mar 10, 2025', status: 'Completed' },
    { icon: '🫁', label: 'Chest X-Ray', date: 'Feb 22, 2025', status: 'Pending' },
    { icon: '💊', label: 'Prescription', date: 'Jan 15, 2025', status: 'Completed' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f0faf7',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── NAVBAR ── */}
      <Box
        sx={{
          position: 'sticky', top: 0, zIndex: 100,
          bgcolor: '#ffffff',
          borderBottom: '1px solid #cce8de',
          px: { xs: 2, md: 5 },
          py: 1.5,
          display: 'flex', alignItems: 'center', gap: 2,
        }}
      >
        <Box
          onClick={() => router.push('/')}
          sx={{
            border: '1px solid #cce8de', borderRadius: '10px',
            p: 0.8, color: '#0d9e72', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            '&:hover': { bgcolor: '#e6f9f2' },
          }}
        >
          <ArrowBack sx={{ fontSize: 20 }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '9px', bgcolor: '#0d9e72',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 13h-2v-2H9v-2h2V9h2v2h2v2h-2v2z" fill="white" />
            </svg>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d9e72' }}>
            SmartHealth AI
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#5a7a70', ml: 1 }}>
          / Medical Records
        </Typography>
      </Box>

      {/* ── MAIN ── */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          px: { xs: 2, md: 4 }, py: 6,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 560 }}>

          {/* Card */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid #cce8de',
              borderRadius: '20px',
              p: { xs: 4, md: 5 },
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(13,158,114,0.08)',
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 88, height: 88, borderRadius: '50%',
                bgcolor: '#e0f7ef',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 28px rgba(13,158,114,0.2)',
                mx: 'auto', mb: 3,
              }}
            >
              <FolderShared sx={{ fontSize: 44, color: '#0d9e72' }} />
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: '1.9rem', fontWeight: 800, color: '#0a2e24',
                letterSpacing: '-0.5px', mb: 0.5,
              }}
            >
              Medical{' '}
              <Box component="span" sx={{ color: '#0d9e72' }}>Records</Box>
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7a9e94', lineHeight: 1.6, mb: 3.5 }}>
              Your health history, all in one place. Full access will be available after backend deployment.
            </Typography>

            {/* Mock records preview */}
            <Box sx={{ textAlign: 'left', mb: 3.5 }}>
              <Typography
                sx={{
                  fontSize: '0.72rem', fontWeight: 700, color: '#4a7268',
                  letterSpacing: '0.8px', mb: 1.5,
                }}
              >
                RECENT RECORDS
              </Typography>

              {mockRecords.map((rec, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    bgcolor: '#f6fdf9',
                    border: '1px solid #cce8de',
                    borderRadius: '12px',
                    px: 2.5, py: 1.6,
                    mb: 1.2,
                    opacity: 0.55 + i * 0.15,
                  }}
                >
                  <Typography sx={{ fontSize: '1.4rem' }}>{rec.icon}</Typography>
                  <Box flex={1}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0a2e24' }}>
                      {rec.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#7a9e94' }}>
                      {rec.date}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.5, py: 0.4,
                      borderRadius: '20px',
                      bgcolor: rec.status === 'Completed' ? '#e0f7ef' : '#fef9ec',
                      border: `1px solid ${rec.status === 'Completed' ? '#b2e8d4' : '#f5d98b'}`,
                      fontSize: '0.7rem', fontWeight: 700,
                      color: rec.status === 'Completed' ? '#0d7a58' : '#b07d00',
                    }}
                  >
                    {rec.status}
                  </Box>
                </Box>
              ))}

              <Typography
                sx={{
                  fontSize: '0.72rem', color: '#7a9e94',
                  fontStyle: 'italic', textAlign: 'center', mt: 1.2,
                }}
              >
                Records preview — full access coming soon
              </Typography>
            </Box>

            {/* Quote */}
            <Box sx={{ pl: 2.5, borderLeft: '3px solid #0d9e72', textAlign: 'left', mb: 3.5 }}>
              <Typography
                sx={{
                  fontSize: '0.88rem', fontStyle: 'italic',
                  color: '#2d5a4a', lineHeight: 1.75, fontWeight: 500,
                }}
              >
                Your medical history is the map to your future health. Keep it close, keep it safe.
              </Typography>
              <Typography
                sx={{
                  mt: 0.8, fontSize: '0.7rem', fontWeight: 700,
                  color: '#0d9e72', letterSpacing: '1px', textTransform: 'uppercase',
                }}
              >
                — SmartHealth AI
              </Typography>
            </Box>

            {/* Button */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
              onClick={() => router.push('/')}
              sx={{
                py: 1.5, borderRadius: '12px',
                textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
                bgcolor: '#0d9e72',
                boxShadow: '0 6px 20px rgba(13,158,114,0.3)',
                '&:hover': {
                  bgcolor: '#0b8860', transform: 'translateY(-1px)',
                  boxShadow: '0 10px 28px rgba(13,158,114,0.4)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Back to Home
            </Button>
          </Box>

          {/* Feature pills */}
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {['🔒 Secure & Private', '🤖 AI-Powered', '📊 Health Tracking'].map((tag) => (
              <Box
                key={tag}
                sx={{
                  px: 2, py: 0.7,
                  bgcolor: '#e0f7ef', borderRadius: '20px',
                  fontSize: '0.75rem', color: '#0d7a58',
                  fontWeight: 600, border: '1px solid #b2e8d4',
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}