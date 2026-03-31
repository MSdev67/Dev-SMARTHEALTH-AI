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
  Divider,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  Lock, 
  Visibility, 
  VisibilityOff, 
  LocalHospital,
  CheckCircle,
} from '@mui/icons-material';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'error';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, phone });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Shared field styles
  const fieldSx = {
    mb: 0,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#ffffff',
      fontSize: '0.9rem',
      '& fieldset': { borderColor: '#cce8de' },
      '&:hover fieldset': { borderColor: '#0d9e72' },
      '&.Mui-focused fieldset': { borderColor: '#0d9e72', borderWidth: 2 },
    },
  };

  const labelSx = {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#4a7268',
    mb: 0.8,
    mt: 2,
    display: 'block',
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
            Start Your{' '}
            <Box component="span" sx={{ color: '#0d9e72' }}>Health</Box>{' '}
            Journey
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: '#5a7a70', lineHeight: 1.7, mb: 4 }}>
            Join thousands who trust SmartHealth AI to monitor their wellbeing, get real-time insights, and stay ahead of their health.
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
              It is health that is real wealth and not pieces of gold and silver. Take the first step — your body will thank you.
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
        <Box
          sx={{
            position: 'absolute', bottom: 0, right: 40,
            zIndex: 1, display: 'flex', alignItems: 'flex-end',
          }}
        >
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

      {/* ── Right Panel (Register Form) ── */}
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
        {/* Top-right sign in button */}
        <Box
          sx={{
            position: 'absolute', top: 28, right: 28,
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
            Have an account?
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push('/login')}
            sx={{
              borderColor: '#0d9e72', color: '#0d9e72', borderRadius: '20px',
              textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 2,
              '&:hover': { bgcolor: '#e6f9f2', borderColor: '#0b8860' },
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* Form header */}
        <Box mb={3} mt={6}>
          <Typography
            sx={{
              fontSize: '1.9rem', fontWeight: 800, color: '#0a2e24',
              letterSpacing: '-0.5px', mb: 0.5,
            }}
          >
            Create Account ✨
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#7a9e94' }}>
            Join SmartHealth AI for personalized health assistance
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2, borderRadius: 2, fontSize: '0.85rem',
              bgcolor: '#fff0f0', border: '1px solid #f5c2c2',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <Typography sx={labelSx}>FULL NAME</Typography>
          <TextField
            fullWidth
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Typography sx={labelSx}>EMAIL ADDRESS</Typography>
          <TextField
            fullWidth
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Typography sx={labelSx}>PHONE NUMBER <Box component="span" sx={{ color: '#aaa', fontWeight: 400 }}>(Optional)</Box></Typography>
          <TextField
            fullWidth
            placeholder="+1 (555) 123-4567"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Typography sx={labelSx}>PASSWORD</Typography>
          <TextField
            fullWidth
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword
                      ? <VisibilityOff sx={{ fontSize: 18, color: '#7a9e94' }} />
                      : <Visibility sx={{ fontSize: 18, color: '#7a9e94' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Strength */}
          {password && (
            <Box mt={1} mb={0.5}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: '#7a9e94', fontSize: '0.72rem' }}>
                  Password Strength
                </Typography>
                <Typography variant="caption" sx={{ color: '#0d9e72', fontWeight: 600, fontSize: '0.72rem' }}>
                  {passwordStrength < 25 && 'Weak'}
                  {passwordStrength >= 25 && passwordStrength < 50 && 'Fair'}
                  {passwordStrength >= 50 && passwordStrength < 75 && 'Good'}
                  {passwordStrength >= 75 && 'Strong'}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                color={getStrengthColor()}
                sx={{ height: 5, borderRadius: 4, bgcolor: '#dff2eb' }}
              />
            </Box>
          )}

          <Typography sx={labelSx}>CONFIRM PASSWORD</Typography>
          <TextField
            fullWidth
            placeholder="••••••••"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#0d9e72', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle sx={{ color: '#0d9e72', fontSize: 18, mr: 0.5 }} />
                  )}
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                    {showConfirmPassword
                      ? <VisibilityOff sx={{ fontSize: 18, color: '#7a9e94' }} />
                      : <Visibility sx={{ fontSize: 18, color: '#7a9e94' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={confirmPassword.length > 0 && password !== confirmPassword}
            helperText={
              confirmPassword.length > 0 && password !== confirmPassword
                ? 'Passwords do not match'
                : ''
            }
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 3.5, mb: 1,
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account →'}
          </Button>

        </form>

        {/* Feature pills */}
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

        {/* Privacy notice */}
        <Box
          sx={{
            mt: 3, p: 1.8,
            bgcolor: '#ffffff',
            borderRadius: 2,
            border: '1px dashed #b2e8d4',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            🔐 By creating an account, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>. Your data is encrypted and secure.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}