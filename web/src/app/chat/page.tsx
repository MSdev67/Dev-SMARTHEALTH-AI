'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from '@mui/material';
import { ArrowBack, Chat as ChatIcon } from '@mui/icons-material';

export default function ChatPage() {
  const router = useRouter();

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
          / AI Chat Assistant
        </Typography>
      </Box>

      {/* ── MAIN CONTENT ── */}
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
            <Stack spacing={3} alignItems="center">

              {/* Icon */}
              <Box
                sx={{
                  width: 88, height: 88, borderRadius: '50%',
                  bgcolor: '#e0f7ef',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 28px rgba(13,158,114,0.2)',
                }}
              >
                <ChatIcon sx={{ fontSize: 44, color: '#0d9e72' }} />
              </Box>

              {/* Title */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '1.9rem', fontWeight: 800, color: '#0a2e24',
                    letterSpacing: '-0.5px', mb: 0.5,
                  }}
                >
                  AI Chat{' '}
                  <Box component="span" sx={{ color: '#0d9e72' }}>Assistant</Box>
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#7a9e94', lineHeight: 1.6 }}>
                  We're building something powerful for you. The AI chat experience
                  will be available once the backend services are deployed.
                </Typography>
              </Box>

              {/* Chat preview mockup */}
              <Box
                sx={{
                  width: '100%',
                  bgcolor: '#f6fdf9',
                  border: '1px solid #cce8de',
                  borderRadius: '14px',
                  p: 2.5,
                  textAlign: 'left',
                }}
              >
                {/* Fake message bubbles */}
                {[
                  { from: 'ai', text: 'Hello! How are you feeling today? 🩺' },
                  { from: 'user', text: 'I have a mild headache since morning.' },
                  { from: 'ai', text: 'I understand. How long has it been and is it throbbing or constant?' },
                ].map((msg, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1.2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '78%',
                        bgcolor: msg.from === 'user' ? '#0d9e72' : '#ffffff',
                        color: msg.from === 'user' ? '#ffffff' : '#2d5a4a',
                        border: msg.from === 'ai' ? '1px solid #cce8de' : 'none',
                        borderRadius: msg.from === 'user'
                          ? '14px 14px 4px 14px'
                          : '14px 14px 14px 4px',
                        px: 2, py: 1,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        opacity: 0.5 + i * 0.2,
                      }}
                    >
                      {msg.text}
                    </Box>
                  </Box>
                ))}

                {/* Typing indicator */}
                <Box sx={{ display: 'flex', gap: 0.6, pl: 0.5, mt: 0.5 }}>
                  {[0, 1, 2].map((dot) => (
                    <Box
                      key={dot}
                      sx={{
                        width: 7, height: 7, borderRadius: '50%',
                        bgcolor: '#0d9e72', opacity: 0.35 + dot * 0.2,
                      }}
                    />
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontSize: '0.72rem', color: '#7a9e94',
                    fontStyle: 'italic', mt: 1.5, textAlign: 'center',
                    letterSpacing: '0.3px',
                  }}
                >
                  Chat interface preview — coming soon
                </Typography>
              </Box>

              {/* Quote */}
              <Box sx={{ width: '100%', pl: 2.5, borderLeft: '3px solid #0d9e72', textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontSize: '0.88rem', fontStyle: 'italic',
                    color: '#2d5a4a', lineHeight: 1.75, fontWeight: 500,
                  }}
                >
                  Good health begins with a good conversation. Ask anything — your AI doctor is almost ready.
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

              {/* Buttons */}
              <Stack direction="row" spacing={1.5} width="100%">
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
                  onClick={() => router.push('/')}
                  sx={{
                    py: 1.5, borderRadius: '12px',
                    textTransform: 'none', fontWeight: 700, fontSize: '0.9rem',
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

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.5, borderRadius: '12px',
                    textTransform: 'none', fontWeight: 600, fontSize: '0.9rem',
                    borderColor: '#0d9e72', color: '#0d9e72',
                    '&:hover': { bgcolor: '#e6f9f2', borderColor: '#0b8860' },
                  }}
                >
                  Learn More
                </Button>
              </Stack>

            </Stack>
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