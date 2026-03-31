'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Small decorative dots */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#38c89a',
              opacity: 0.5,
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              zIndex: 0,
            }}
          />
        ))}
        {/* Wavy line accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 80,
            left: 40,
            zIndex: 0,
            opacity: 0.15,
          }}
        >
          <svg width="200" height="60" viewBox="0 0 200 60">
            <path
              d="M0 30 Q25 0 50 30 Q75 60 100 30 Q125 0 150 30 Q175 60 200 30"
              stroke="#0d9e72"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </Box>

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: '#0d9e72',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 13h-2v-2H9v-2h2V9h2v2h2v2h-2v2z"
                  fill="white"
                />
              </svg>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#0d9e72',
                letterSpacing: '-0.3px',
              }}
            >
              SmartHealth AI
            </Typography>
          </Box>
        </Box>

        {/* Hero text */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
          <Typography
            sx={{
              fontSize: '2.6rem',
              fontWeight: 800,
              lineHeight: 1.2,
              color: '#0a2e24',
              mb: 2,
              letterSpacing: '-1px',
            }}
          >
            Get Quick{' '}
            <Box component="span" sx={{ color: '#0d9e72' }}>
              Medical
            </Box>{' '}
            Services
          </Typography>
          <Typography
            sx={{
              fontSize: '0.95rem',
              color: '#5a7a70',
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            Your personal AI-powered health assistant — track vitals, get insights, and connect with care professionals anytime.
          </Typography>

          {/* Quote block */}
          <Box
            sx={{
              mt: 1,
              pl: 2.5,
              borderLeft: '3px solid #0d9e72',
              position: 'relative',
            }}
          >
            {/* Large decorative quote mark */}
            <Typography
              sx={{
                position: 'absolute',
                top: -18,
                left: 8,
                fontSize: '4rem',
                lineHeight: 1,
                color: '#0d9e72',
                opacity: 0.18,
                fontFamily: 'Georgia, serif',
                userSelect: 'none',
              }}
            >
              "
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                fontStyle: 'italic',
                color: '#2d5a4a',
                lineHeight: 1.75,
                fontWeight: 500,
                letterSpacing: '0.1px',
              }}
            >
              The greatest wealth is health. Let AI be the guardian of yours — always watching, always learning, always caring.
            </Typography>
            <Typography
              sx={{
                mt: 1.2,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0d9e72',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              — SmartHealth AI
            </Typography>
          </Box>
        </Box>

        {/* Doctor illustration placeholder */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 40,
            zIndex: 1,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <svg width="220" height="300" viewBox="0 0 220 300" fill="none">
            {/* Body */}
            <ellipse cx="110" cy="280" rx="55" ry="20" fill="#d4f0e5" />
            <rect x="70" y="160" width="80" height="130" rx="20" fill="#ffffff" stroke="#0d9e72" strokeWidth="2" />
            {/* White coat cross */}
            <rect x="105" y="175" width="10" height="30" rx="3" fill="#0d9e72" />
            <rect x="96" y="184" width="28" height="10" rx="3" fill="#0d9e72" />
            {/* Head */}
            <circle cx="110" cy="130" r="38" fill="#ffe0c8" />
            {/* Hair */}
            <ellipse cx="110" cy="100" rx="38" ry="18" fill="#5a3a1a" />
            {/* Eyes */}
            <circle cx="97" cy="130" r="4" fill="#fff" />
            <circle cx="123" cy="130" r="4" fill="#fff" />
            <circle cx="98" cy="131" r="2" fill="#333" />
            <circle cx="124" cy="131" r="2" fill="#333" />
            {/* Smile */}
            <path d="M100 145 Q110 155 120 145" stroke="#c0764a" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Arms */}
            <rect x="30" y="165" width="42" height="14" rx="7" fill="#ffffff" stroke="#0d9e72" strokeWidth="2" transform="rotate(20 30 165)" />
            <rect x="148" y="165" width="42" height="14" rx="7" fill="#ffffff" stroke="#0d9e72" strokeWidth="2" transform="rotate(-20 190 165)" />
            {/* Stethoscope */}
            <path d="M85 195 Q75 215 85 225 Q95 235 105 220" stroke="#888" strokeWidth="2.5" fill="none" />
            <circle cx="105" cy="218" r="6" fill="#555" />
          </svg>
        </Box>
      </Box>

      {/* ── Right Panel (Login Form) ── */}
      <Box
        sx={{
          width: { xs: '100%', md: '420px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 5 },
          py: 6,
          bgcolor: '#f0faf7',
          position: 'relative',
        }}
      >
        {/* Top-right register button */}
        <Box
          sx={{
            position: 'absolute',
            top: 28,
            right: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
            No account?
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push('/register')}
            sx={{
              borderColor: '#0d9e72',
              color: '#0d9e72',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 2,
              '&:hover': { bgcolor: '#e6f9f2', borderColor: '#0b8860' },
            }}
          >
            Register Now
          </Button>
        </Box>

        {/* Form header */}
        <Box mb={4}>
          <Typography
            sx={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#0a2e24',
              letterSpacing: '-0.5px',
              mb: 0.5,
            }}
          >
            Welcome Back 👋
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#7a9e94' }}>
            Sign in to your SmartHealth account
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              fontSize: '0.85rem',
              bgcolor: '#fff0f0',
              border: '1px solid #f5c2c2',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Typography
            sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a7268', mb: 0.8 }}
          >
            EMAIL ADDRESS
          </Typography>
          <TextField
            fullWidth
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#ffffff',
                fontSize: '0.9rem',
                '& fieldset': { borderColor: '#cce8de' },
                '&:hover fieldset': { borderColor: '#0d9e72' },
                '&.Mui-focused fieldset': { borderColor: '#0d9e72', borderWidth: 2 },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Typography
            sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a7268', mb: 0.8 }}
          >
            PASSWORD
          </Typography>
          <TextField
            fullWidth
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#ffffff',
                fontSize: '0.9rem',
                '& fieldset': { borderColor: '#cce8de' },
                '&:hover fieldset': { borderColor: '#0d9e72' },
                '&.Mui-focused fieldset': { borderColor: '#0d9e72', borderWidth: 2 },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 18, color: '#7a9e94' }} />
                    ) : (
                      <Visibility sx={{ fontSize: 18, color: '#7a9e94' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign="right" mb={3}>
            <Link
              href="#"
              sx={{
                fontSize: '0.78rem',
                color: '#0d9e72',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              py: 1.6,
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'none',
              letterSpacing: '0.2px',
              bgcolor: '#0d9e72',
              boxShadow: '0 8px 24px rgba(13,158,114,0.35)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#0b8860',
                boxShadow: '0 12px 30px rgba(13,158,114,0.45)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': { bgcolor: '#a8d9c8' },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Get Services →'}
          </Button>
        </form>

        {/* Feature pills */}
        <Box
          sx={{
            mt: 5,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {['🔒 Secure & Private', '🤖 AI-Powered', '📊 Health Tracking'].map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 2,
                py: 0.7,
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

        {/* Demo note */}
        <Box
          sx={{
            mt: 3,
            p: 1.8,
            bgcolor: '#ffffff',
            borderRadius: 2,
            border: '1px dashed #b2e8d4',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            💡 <strong>Demo Mode:</strong> Create a new account or login with existing credentials
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}