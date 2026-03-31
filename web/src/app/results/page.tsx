'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack, CheckCircle, Warning, Info } from '@mui/icons-material';

export default function ResultsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions));
    }
    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle />;
      case 'medium': return <Warning />;
      case 'high': return <Info />;
      default: return <Info />;
    }
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.7) return { bar: '#0d9e72', bg: '#e0f7ef' };
    if (confidence >= 0.4) return { bar: '#f59e0b', bg: '#fef9ec' };
    return { bar: '#ef4444', bg: '#fff5f5' };
  };

  if (loading) {
    return (
      <Box
        display="flex" justifyContent="center" alignItems="center"
        minHeight="100vh" bgcolor="#f0faf7"
        sx={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      >
        <Box textAlign="center">
          <Box
            sx={{
              width: 56, height: 56, borderRadius: '50%',
              bgcolor: '#e0f7ef', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 13h-2v-2H9v-2h2V9h2v2h2v2h-2v2z" fill="#0d9e72" />
            </svg>
          </Box>
          <Typography sx={{ color: '#4a7268', fontWeight: 600, fontSize: '0.95rem' }}>
            Loading results...
          </Typography>
        </Box>
      </Box>
    );
  }

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
        <IconButton
          onClick={() => router.push('/')}
          sx={{
            border: '1px solid #cce8de', borderRadius: '10px',
            p: 0.8, color: '#0d9e72',
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

        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#5a7a70', ml: 1 }}>
          / Analysis Results
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* ── DISCLAIMER ── */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            border: '1px solid #cce8de',
            borderLeft: '4px solid #0d9e72',
            borderRadius: '12px',
            px: 3, py: 2,
            mb: 4,
            display: 'flex', gap: 1.5, alignItems: 'flex-start',
          }}
        >
          <Info sx={{ color: '#0d9e72', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.85rem', color: '#4a7268', lineHeight: 1.6 }}>
            <Box component="span" sx={{ fontWeight: 700, color: '#0a2e24' }}>Important: </Box>
            These predictions are AI-generated and should not replace professional medical advice. Please consult a healthcare provider for accurate diagnosis.
          </Typography>
        </Box>

        {/* ── HEADER ── */}
        <Box mb={4}>
          <Typography
            sx={{
              fontSize: '2rem', fontWeight: 800, color: '#0a2e24',
              letterSpacing: '-0.5px', mb: 0.5,
            }}
          >
            Disease{' '}
            <Box component="span" sx={{ color: '#0d9e72' }}>Predictions</Box>
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#7a9e94' }}>
            Based on your symptoms, here are the possible conditions:
          </Typography>
        </Box>

        {/* ── PREDICTION CARDS ── */}
        {predictions.map((prediction, index) => {
          const conf = getConfidenceBg(prediction.confidence);
          return (
            <Box
              key={index}
              sx={{
                bgcolor: '#ffffff',
                border: '1px solid #cce8de',
                borderRadius: '16px',
                p: 3,
                mb: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 8px 28px rgba(13,158,114,0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Top row */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#0a2e24', mb: 1 }}
                  >
                    {prediction.disease}
                  </Typography>
                  <Chip
                    icon={getSeverityIcon(prediction.severity)}
                    label={`${prediction.severity} risk`}
                    color={getSeverityColor(prediction.severity) as any}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: '0.72rem', borderRadius: '8px' }}
                  />
                </Box>

                {/* Confidence badge */}
                <Box
                  sx={{
                    bgcolor: conf.bg,
                    border: `1px solid ${conf.bar}30`,
                    borderRadius: '12px',
                    px: 2.5, py: 1.2,
                    textAlign: 'center',
                    minWidth: 80,
                  }}
                >
                  <Typography
                    sx={{ fontSize: '1.8rem', fontWeight: 800, color: conf.bar, lineHeight: 1 }}
                  >
                    {Math.round(prediction.confidence * 100)}%
                  </Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#7a9e94', fontWeight: 600, letterSpacing: '0.5px', mt: 0.3 }}>
                    CONFIDENCE
                  </Typography>
                </Box>
              </Box>

              {/* Progress bar */}
              <LinearProgress
                variant="determinate"
                value={prediction.confidence * 100}
                sx={{
                  mb: 2.5, height: 7, borderRadius: 4,
                  bgcolor: conf.bg,
                  '& .MuiLinearProgress-bar': { bgcolor: conf.bar, borderRadius: 4 },
                }}
              />

              {/* Description */}
              <Typography sx={{ fontSize: '0.9rem', color: '#4a7268', lineHeight: 1.7, mb: 3 }}>
                {prediction.description}
              </Typography>

              {/* Recommendations */}
              <Box
                sx={{
                  bgcolor: '#f6fdf9',
                  border: '1px solid #cce8de',
                  borderRadius: '12px',
                  p: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem', fontWeight: 700, color: '#4a7268',
                    letterSpacing: '0.8px', mb: 1.5,
                  }}
                >
                  RECOMMENDATIONS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {prediction.recommendations.map((rec: string, idx: number) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 6, height: 6, borderRadius: '50%',
                          bgcolor: '#0d9e72', mt: 0.7, flexShrink: 0,
                        }}
                      />
                      <Typography sx={{ fontSize: '0.85rem', color: '#2d5a4a', lineHeight: 1.6 }}>
                        {rec}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* ── EMPTY STATE ── */}
        {predictions.length === 0 && (
          <Box
            sx={{
              bgcolor: '#ffffff', border: '1px dashed #b2e8d4',
              borderRadius: '16px', p: 6, textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🩺</Typography>
            <Typography sx={{ fontWeight: 700, color: '#0a2e24', mb: 0.5 }}>No results found</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#7a9e94' }}>
              Please run a symptom analysis first.
            </Typography>
          </Box>
        )}

        {/* ── ACTION BUTTONS ── */}
        <Box display="flex" gap={2} mt={5} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => router.push('/symptom-checker')}
            sx={{
              borderRadius: '12px', textTransform: 'none',
              fontWeight: 700, fontSize: '0.9rem',
              bgcolor: '#0d9e72', px: 3.5, py: 1.4,
              boxShadow: '0 6px 20px rgba(13,158,114,0.3)',
              '&:hover': {
                bgcolor: '#0b8860', transform: 'translateY(-1px)',
                boxShadow: '0 10px 28px rgba(13,158,114,0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            New Analysis →
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.push('/')}
            sx={{
              borderRadius: '12px', textTransform: 'none',
              fontWeight: 600, fontSize: '0.9rem',
              borderColor: '#0d9e72', color: '#0d9e72', px: 3.5, py: 1.4,
              '&:hover': { bgcolor: '#e6f9f2', borderColor: '#0b8860' },
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* ── FEATURE PILLS ── */}
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

      </Container>
    </Box>
  );
}