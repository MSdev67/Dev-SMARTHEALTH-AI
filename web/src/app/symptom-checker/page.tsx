'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../services/api';

import {
  Container, Box, Typography, TextField, Button, Paper, Card,
  CardContent, Grid, Chip, FormControl, InputLabel, Select,
  MenuItem, Alert, CircularProgress, IconButton, AppBar,
  Toolbar, Stepper, Step, StepLabel, List, ListItem,
  ListItemText, ListItemIcon, Switch
} from '@mui/material';

import {
  Delete, Add, ArrowBack, CheckCircle,
  LocalHospital, CalendarToday, TrendingUp,
  DarkMode, LightMode
} from '@mui/icons-material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description?: string;
}

const steps = ['Add Symptoms', 'Review', 'Analyze'];

const commonSymptoms = [
  'Fever','Cough','Headache','Fatigue','Sore Throat',
  'Runny Nose','Body Aches','Nausea','Diarrhea','Shortness of Breath'
];

export default function SymptomCheckerPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#0d9e72' },
      },
      shape: { borderRadius: 12 }
    }), [darkMode]);

  const addSymptom = () => {
    if (!symptomName.trim() || !duration.trim()) {
      setError('Please enter symptom name and duration');
      return;
    }
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity,
      duration,
      description
    };
    setSymptoms([...symptoms, newSymptom]);
    setSymptomName('');
    setDuration('');
    setDescription('');
    setError('');
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const addQuickSymptom = (name: string) => {
    setSymptoms([...symptoms, {
      id: Date.now().toString(),
      name,
      severity: 'mild',
      duration: '1 day'
    }]);
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.length) return setError('Add at least one symptom');
    setIsLoading(true);
    try {
      const res = await apiService.analyzeSymptoms({ symptoms });
      if (res.success) {
        localStorage.setItem('predictions', JSON.stringify(res.data.predictions));
        router.push('/results');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    return sev === 'mild' ? 'success' : sev === 'moderate' ? 'warning' : 'error';
  };

  // Shared field style
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
      fontSize: '0.9rem',
      '& fieldset': { borderColor: '#cce8de' },
      '&:hover fieldset': { borderColor: '#0d9e72' },
      '&.Mui-focused fieldset': { borderColor: '#0d9e72', borderWidth: 2 },
    },
  };

  const labelSx = {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#4a7268',
    letterSpacing: '0.7px',
    mb: 0.7,
    display: 'block',
  };

  const panelSx = {
    bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#ffffff',
    border: '1px solid #cce8de',
    borderRadius: '16px',
    p: 3,
    mb: 3,
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: darkMode ? '#0e1f1a' : '#f0faf7',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        {/* ── NAVBAR ── */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            bgcolor: darkMode ? '#0a1a14' : '#ffffff',
            borderBottom: '1px solid #cce8de',
            px: { xs: 2, md: 5 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => router.push('/')}
            sx={{
              border: '1px solid #cce8de',
              borderRadius: '10px',
              p: 0.8,
              color: '#0d9e72',
              '&:hover': { bgcolor: '#e6f9f2' },
            }}
          >
            <ArrowBack sx={{ fontSize: 20 }} />
          </IconButton>

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

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '0.9rem',
              color: darkMode ? '#a0c8ba' : '#5a7a70',
              ml: 1,
            }}
          >
            / Symptom Checker
          </Typography>

          <Box flex={1} />

          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              border: '1px solid #cce8de',
              borderRadius: '10px',
              p: 0.8,
              color: '#0d9e72',
              '&:hover': { bgcolor: '#e6f9f2' },
            }}
          >
            {darkMode ? <LightMode sx={{ fontSize: 20 }} /> : <DarkMode sx={{ fontSize: 20 }} />}
          </IconButton>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>

          {/* ── STEPPER ── */}
          <Box sx={{ ...panelSx, mb: 4 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((s) => (
                <Step key={s}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: darkMode ? '#a0c8ba' : '#4a7268',
                      },
                      '& .MuiStepIcon-root.Mui-active': { color: '#0d9e72' },
                      '& .MuiStepIcon-root.Mui-completed': { color: '#0d9e72' },
                    }}
                  >
                    {s}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* ── ERROR ── */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3, borderRadius: '12px', fontSize: '0.85rem',
                bgcolor: '#fff0f0', border: '1px solid #f5c2c2', color: '#b00020',
              }}
            >
              {error}
            </Alert>
          )}

          {/* ── STEP 1 ── */}
          {activeStep === 0 && (
            <>
              {/* Quick symptoms */}
              <Box sx={panelSx}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: darkMode ? '#c8ede3' : '#0a2e24', mb: 0.5 }}>
                  Quick Add
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#7a9e94', mb: 2 }}>
                  Tap a symptom to add it instantly
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {commonSymptoms.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      clickable
                      onClick={() => addQuickSymptom(s)}
                      sx={{
                        bgcolor: '#e0f7ef',
                        color: '#0d7a58',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        border: '1px solid #b2e8d4',
                        borderRadius: '20px',
                        '&:hover': { bgcolor: '#c5f0e0' },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Custom symptom form */}
              <Box sx={panelSx}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: darkMode ? '#c8ede3' : '#0a2e24', mb: 0.5 }}>
                  Add Custom Symptom
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#7a9e94', mb: 2.5 }}>
                  Describe your symptom in detail
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={labelSx}>SYMPTOM NAME</Typography>
                    <TextField
                      fullWidth placeholder="e.g. Headache"
                      value={symptomName}
                      onChange={(e) => setSymptomName(e.target.value)}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={labelSx}>SEVERITY</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        sx={{
                          borderRadius: '12px',
                          bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cce8de' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0d9e72' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0d9e72', borderWidth: 2 },
                        }}
                      >
                        <MenuItem value="mild">😊 Mild</MenuItem>
                        <MenuItem value="moderate">😐 Moderate</MenuItem>
                        <MenuItem value="severe">😰 Severe</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={labelSx}>DURATION</Typography>
                    <TextField
                      fullWidth placeholder="e.g. 2 days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={labelSx}>ADDITIONAL DETAILS</Typography>
                    <TextField
                      fullWidth placeholder="Any extra notes..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addSymptom}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        bgcolor: '#0d9e72',
                        boxShadow: '0 6px 20px rgba(13,158,114,0.3)',
                        '&:hover': {
                          bgcolor: '#0b8860',
                          boxShadow: '0 10px 28px rgba(13,158,114,0.4)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Add Symptom
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Symptom cards */}
              {symptoms.length > 0 && (
                <>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#4a7268', letterSpacing: '0.8px', mb: 1.5 }}>
                    ADDED SYMPTOMS ({symptoms.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {symptoms.map((symptom) => (
                      <Grid item xs={12} md={4} key={symptom.id}>
                        <Box
                          sx={{
                            bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#ffffff',
                            border: '1px solid #cce8de',
                            borderRadius: '14px',
                            p: 2.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(13,158,114,0.12)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: darkMode ? '#c8ede3' : '#0a2e24' }}>
                              {symptom.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => removeSymptom(symptom.id)}
                              sx={{
                                color: '#e57373',
                                bgcolor: '#fff5f5',
                                borderRadius: '8px',
                                p: 0.5,
                                '&:hover': { bgcolor: '#ffebee' },
                              }}
                            >
                              <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          <Chip
                            label={symptom.severity}
                            color={getSeverityColor(symptom.severity) as any}
                            size="small"
                            sx={{ my: 1, fontWeight: 600, fontSize: '0.72rem', borderRadius: '8px' }}
                          />

                          <Box display="flex" alignItems="center" gap={0.8}>
                            <CalendarToday sx={{ fontSize: 14, color: '#7a9e94' }} />
                            <Typography sx={{ fontSize: '0.82rem', color: '#7a9e94' }}>
                              {symptom.duration}
                            </Typography>
                          </Box>

                          {symptom.description && (
                            <Typography sx={{ fontSize: '0.78rem', color: '#7a9e94', mt: 1, fontStyle: 'italic' }}>
                              {symptom.description}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </>
          )}

          {/* ── STEP 2 ── */}
          {activeStep === 1 && (
            <Box sx={panelSx}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: darkMode ? '#c8ede3' : '#0a2e24', mb: 0.5 }}>
                Review Symptoms
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#7a9e94', mb: 3 }}>
                Please confirm your symptom list before analysis
              </Typography>

              {symptoms.map((s) => (
                <Box
                  key={s.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : '#f6fdf9',
                    border: '1px solid #cce8de',
                    borderRadius: '12px',
                    px: 2.5,
                    py: 1.8,
                    mb: 1.5,
                  }}
                >
                  <CheckCircle sx={{ color: '#0d9e72', fontSize: 22, flexShrink: 0 }} />
                  <Box flex={1}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: darkMode ? '#c8ede3' : '#0a2e24' }}>
                      {s.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#7a9e94' }}>
                      {s.severity} · {s.duration}
                    </Typography>
                  </Box>
                  <Chip
                    label={s.severity}
                    color={getSeverityColor(s.severity) as any}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: '0.72rem', borderRadius: '8px' }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* ── STEP 3 ── */}
          {activeStep === 2 && (
            <Box
              sx={{
                ...panelSx,
                textAlign: 'center',
                py: 6,
              }}
            >
              <Box
                sx={{
                  width: 90, height: 90, borderRadius: '50%',
                  bgcolor: '#e0f7ef',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 3,
                  boxShadow: '0 8px 28px rgba(13,158,114,0.2)',
                }}
              >
                <TrendingUp sx={{ fontSize: 46, color: '#0d9e72' }} />
              </Box>

              <Typography sx={{ fontWeight: 800, fontSize: '1.7rem', color: darkMode ? '#c8ede3' : '#0a2e24', mb: 1 }}>
                Ready to Analyze
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#7a9e94', mb: 1 }}>
                {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} queued for AI analysis
              </Typography>

              {/* Quote */}
              <Box sx={{ mx: 'auto', maxWidth: 360, my: 3, pl: 2.5, borderLeft: '3px solid #0d9e72', textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.88rem', fontStyle: 'italic', color: '#2d5a4a', lineHeight: 1.7 }}>
                  Early detection is the best protection. Let AI surface the insights your body is trying to tell you.
                </Typography>
                <Typography sx={{ mt: 0.8, fontSize: '0.7rem', fontWeight: 700, color: '#0d9e72', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  — SmartHealth AI
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={analyzeSymptoms}
                sx={{
                  px: 5, py: 1.6,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: '#0d9e72',
                  boxShadow: '0 8px 24px rgba(13,158,114,0.35)',
                  '&:hover': {
                    bgcolor: '#0b8860',
                    boxShadow: '0 12px 30px rgba(13,158,114,0.45)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Run Analysis →'}
              </Button>
            </Box>
          )}

          {/* ── NAV BUTTONS ── */}
          <Box mt={4} display="flex" alignItems="center">
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                color: '#0d9e72',
                border: '1px solid #cce8de',
                px: 3, py: 1.2,
                '&:hover': { bgcolor: '#e6f9f2' },
                '&:disabled': { opacity: 0.35 },
              }}
            >
              ← Back
            </Button>

            <Box flex={1} />

            {activeStep < 2 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep((prev) => prev + 1)}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  bgcolor: '#0d9e72',
                  px: 3, py: 1.2,
                  boxShadow: '0 6px 18px rgba(13,158,114,0.3)',
                  '&:hover': { bgcolor: '#0b8860', transform: 'translateY(-1px)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Next →
              </Button>
            )}
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
}