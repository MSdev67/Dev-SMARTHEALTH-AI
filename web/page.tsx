'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Fade,
  Zoom,
  alpha,
  Stack,
  Chip,
} from '@mui/material';
import {
  LocalHospital,
  Chat,
  CalendarMonth,
  FolderShared,
  History,
  Brightness4,
  Brightness7,
  Logout,
  Person,
  TrendingUp,
  NotificationsNone,
  Settings,
} from '@mui/icons-material';

export default function Home() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.body.style.backgroundColor = savedMode ? '#0a0e27' : '#f5f7fa';
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.body.style.backgroundColor = newMode ? '#0a0e27' : '#f5f7fa';
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ bgcolor: darkMode ? '#0a0e27' : '#f5f7fa' }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!user) return null;

  const features = [
    {
      title: 'Symptom Checker',
      description: 'AI-powered disease prediction from your symptoms',
      icon: <LocalHospital sx={{ fontSize: 48 }} />,
      path: '/symptom-checker',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea',
      badge: 'AI Powered',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Get instant health guidance from our medical AI',
      icon: <Chat sx={{ fontSize: 48 }} />,
      path: '/chat',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb',
      badge: 'Live',
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage medical appointments easily',
      icon: <CalendarMonth sx={{ fontSize: 48 }} />,
      path: '/appointments',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe',
      badge: 'New',
    },
    {
      title: 'Medical Records',
      description: 'Secure access to your complete medical history',
      icon: <FolderShared sx={{ fontSize: 48 }} />,
      path: '/records',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: '#43e97b',
    },
    {
      title: 'Prediction History',
      description: 'View and track your past health analyses',
      icon: <History sx={{ fontSize: 48 }} />,
      path: '/history',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: '#fa709a',
    },
  ];

  const bgColor = darkMode ? '#0a0e27' : '#f5f7fa';
  const cardBg = darkMode ? '#1a1f3a' : '#ffffff';
  const textPrimary = darkMode ? '#ffffff' : '#1a202c';
  const textSecondary = darkMode ? '#a0aec0' : '#718096';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: bgColor, transition: 'all 0.3s ease' }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: darkMode 
            ? 'linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              }}
            >
              <LocalHospital sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                SmartHealth AI
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Your Health Companion
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit">
              <NotificationsNone />
            </IconButton>
            
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <Box 
              onClick={handleMenu}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {user.email}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#fff', color: '#667eea', fontWeight: 700, width: 42, height: 42 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: '16px',
                bgcolor: cardBg,
                '& .MuiMenuItem-root': { borderRadius: '8px', mx: 1, my: 0.5 },
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); router.push('/profile'); }}>
              <Person sx={{ mr: 2, fontSize: 20 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); router.push('/settings'); }}>
              <Settings sx={{ mr: 2, fontSize: 20 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 2, fontSize: 20 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Fade in timeout={800}>
          <Box mb={6}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight={800} sx={{ color: textPrimary }}>
              Welcome back, {user.name.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="h6" sx={{ color: textSecondary, fontWeight: 400 }}>
              How can we help you today?
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={3} mb={6}>
          {[
            { label: 'Health Score', value: '98%', icon: <TrendingUp />, color: '#43e97b' },
            { label: 'Active Days', value: '12', icon: <CalendarMonth />, color: '#4facfe' },
            { label: 'Predictions', value: '0', icon: <LocalHospital />, color: '#f093fb' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Zoom in timeout={500 + index * 100}>
                <Card
                  sx={{
                    background: darkMode ? cardBg : 'white',
                    borderRadius: '20px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: darkMode ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ color: textSecondary, mb: 1 }}>{stat.label}</Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ color: textPrimary }}>{stat.value}</Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          width: 56, height: 56, borderRadius: '16px',
                          background: `${stat.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" fontWeight={700} mb={3} sx={{ color: textPrimary }}>
          Explore Features
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Zoom in timeout={600 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    background: darkMode ? cardBg : 'white',
                    borderRadius: '24px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    overflow: 'visible',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: darkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.15)',
                      '& .feature-icon': { transform: 'scale(1.1) rotate(5deg)' },
                      '& .get-started-btn': { background: feature.gradient, color: 'white' },
                    },
                  }}
                  onClick={() => router.push(feature.path)}
                >
                  {feature.badge && (
                    <Chip 
                      label={feature.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: feature.gradient,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        width: 96, height: 96,
                        margin: '0 auto 24px',
                        borderRadius: '24px',
                        background: feature.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        transition: 'all 0.3s',
                        boxShadow: `0 8px 24px ${alpha(feature.color, 0.4)}`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={700} sx={{ color: textPrimary, mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: textSecondary, mb: 3, lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 4, pt: 0, justifyContent: 'center' }}>
                    <Button
                      className="get-started-btn"
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{
                        borderRadius: '16px',
                        py: 1.5,
                        fontWeight: 700,
                        borderColor: feature.color,
                        color: feature.color,
                        textTransform: 'none',
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2, borderColor: feature.color },
                      }}
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Fade in timeout={1000}>
          <Box 
            mt={6} 
            p={4} 
            sx={{
              background: darkMode 
                ? 'linear-gradient(135deg, #c31432 0%, #240b36 100%)'
                : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              borderRadius: '24px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(238, 90, 111, 0.3)',
            }}
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Box 
                sx={{ 
                  width: 64, height: 64, borderRadius: '16px',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalHospital sx={{ fontSize: 40 }} />
              </Box>
              <Box flex={1}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Medical Emergency?</Typography>
                <Typography variant="body1" sx={{ opacity: 0.95 }}>
                  For urgent situations, call <strong>911</strong> or your local emergency number immediately.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" sx={{ color: textSecondary }}>
            ⚕️ This AI-powered system provides general health information. Always consult healthcare professionals.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
