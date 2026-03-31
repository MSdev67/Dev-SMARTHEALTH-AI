'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';import {
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
} from '@mui/material';
import {
  LocalHospital,
  Chat,
  CalendarMonth,
  FolderShared,
  AccountCircle,
  History,
} from '@mui/icons-material';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      title: 'Symptom Checker',
      description: 'Analyze your symptoms with AI-powered disease prediction',
      icon: <LocalHospital sx={{ fontSize: 60, color: '#4CAF50' }} />,
      path: '/symptom-checker',
      color: '#4CAF50',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Chat with our medical AI for health guidance',
      icon: <Chat sx={{ fontSize: 60, color: '#2196F3' }} />,
      path: '/chat',
      color: '#2196F3',
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage your medical appointments',
      icon: <CalendarMonth sx={{ fontSize: 60, color: '#9C27B0' }} />,
      path: '/appointments',
      color: '#9C27B0',
    },
    {
      title: 'Medical Records',
      description: 'View and manage your medical records securely',
      icon: <FolderShared sx={{ fontSize: 60, color: '#FF9800' }} />,
      path: '/records',
      color: '#FF9800',
    },
    {
      title: 'Prediction History',
      description: 'View your past symptom analyses and predictions',
      icon: <History sx={{ fontSize: 60, color: '#00BCD4' }} />,
      path: '/history',
      color: '#00BCD4',
    },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartHealth AI
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1">{user.name}</Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); router.push('/profile'); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box mb={6}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Welcome, {user.name}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            How can we help you today?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => router.push(feature.path)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      bgcolor: feature.color,
                      '&:hover': {
                        bgcolor: feature.color,
                        opacity: 0.9,
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={6} p={4} bgcolor="#ffebee" borderRadius={2} border="2px solid #f44336">
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <LocalHospital sx={{ fontSize: 40, color: '#f44336' }} />
            <Typography variant="h5" color="error.dark" fontWeight="bold">
              Medical Emergency?
            </Typography>
          </Box>
          <Typography variant="body1" color="error.dark" gutterBottom>
            For medical emergencies, call <strong>911</strong> or your local emergency number immediately.
          </Typography>
          <Typography variant="body2" color="error.dark">
            This AI assistant is not a substitute for emergency medical care.
          </Typography>
        </Box>

        <Box mt={4} p={3} bgcolor="#e3f2fd" borderRadius={2}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            ⚕️ This AI-powered system provides general health information. Always consult with healthcare professionals for medical advice.
          </Typography>
        </Box>
      </Container>
    </>
  );
}