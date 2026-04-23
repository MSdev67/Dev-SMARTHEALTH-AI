'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Select,
  FormControl,
  Chip,
  Paper,
  Badge,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  LocalHospital,
  Chat,
  CalendarMonth,
  FolderShared,
  History,
  Logout,
  Person,
  Language,
  VideoCall,
  Phone,
  Schedule,
  FormatQuote,
  Healing,
  Security,
  Speed,
  Favorite,
  Notifications,
  ArrowForward,
  CheckCircle,
  Star,
  TrendingUp,
  MedicalServices,
  HealthAndSafety,
  MonitorHeart,
  Psychology,
  Menu as MenuIcon,
  Close,
  KeyboardArrowUp,
} from '@mui/icons-material';

// Language translations
const translations = {
  en: {
    welcome: 'Welcome back',
    tagline: 'Smarter AI Healthcare Starts Here',
    description: 'AI-powered medical platform to transform healthcare delivery',
    bookConsultation: 'Book Free Consultation',
    watchDemo: 'Watch Demo',
    features: 'Our Features',
    whyChooseUs: 'Why Choose Us',
    symptomChecker: 'Symptom Checker',
    symptomDesc: 'AI-powered disease prediction',
    aiChat: 'AI Chat Assistant',
    aiChatDesc: 'Get instant health guidance',
    appointments: 'Appointments',
    appointmentsDesc: 'Schedule consultations',
    medicalRecords: 'Medical Records',
    recordsDesc: 'Secure health records',
    predictionHistory: 'Prediction History',
    historyDesc: 'View past analyses',
    connectDoctor: 'Connect with Doctors',
    videoConsult: 'Video Consultation',
    phoneConsult: 'Phone Consultation',
    scheduleAppt: 'Schedule Appointment',
    emergency: 'Medical Emergency?',
    emergencyDesc: 'For urgent situations, call 911 immediately',
    quote: 'Your health is our priority. We combine cutting-edge AI with compassionate care.',
    quoteAuthor: 'SmartHealth AI Team',
    aiPowered: 'AI-Powered Diagnosis',
    aiPoweredDesc: '99% accuracy in disease prediction',
    securePlatform: 'Secure Platform',
    securePlatformDesc: 'HIPAA compliant data protection',
    fastService: '24/7 Availability',
    fastServiceDesc: 'Round-the-clock medical support',
    trustedCare: 'Trusted Care',
    trustedCareDesc: 'Certified healthcare professionals',
  },
  kn: {
    welcome: 'ಮರಳಿ ಸ್ವಾಗತ',
    tagline: 'ಬುದ್ಧಿವಂತ AI ಆರೋಗ್ಯ ಇಲ್ಲಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ',
    description: 'ಆರೋಗ್ಯ ವಿತರಣೆಯನ್ನು ಪರಿವರ್ತಿಸಲು AI-ಚಾಲಿತ ವೈದ್ಯಕೀಯ ವೇದಿಕೆ',
    bookConsultation: 'ಉಚಿತ ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ',
    watchDemo: 'ಡೆಮೋ ವೀಕ್ಷಿಸಿ',
    features: 'ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು',
    whyChooseUs: 'ನಮ್ಮನ್ನು ಏಕೆ ಆರಿಸಬೇಕು',
    symptomChecker: 'ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ',
    symptomDesc: 'AI-ಚಾಲಿತ ರೋಗ ಮುನ್ಸೂಚನೆ',
    aiChat: 'AI ಚಾಟ್ ಸಹಾಯಕ',
    aiChatDesc: 'ತ್ವರಿತ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ',
    appointments: 'ನೇಮಕಾತಿಗಳು',
    appointmentsDesc: 'ಸಮಾಲೋಚನೆಗಳನ್ನು ನಿಗದಿಪಡಿಸಿ',
    medicalRecords: 'ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು',
    recordsDesc: 'ಸುರಕ್ಷಿತ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು',
    predictionHistory: 'ಮುನ್ಸೂಚನೆ ಇತಿಹಾಸ',
    historyDesc: 'ಹಿಂದಿನ ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    connectDoctor: 'ವೈದ್ಯರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
    videoConsult: 'ವೀಡಿಯೊ ಸಮಾಲೋಚನೆ',
    phoneConsult: 'ಫೋನ್ ಸಮಾಲೋಚನೆ',
    scheduleAppt: 'ನೇಮಕಾತಿ ನಿಗದಿಪಡಿಸಿ',
    emergency: 'ವೈದ್ಯಕೀಯ ತುರ್ತು?',
    emergencyDesc: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳಿಗೆ, ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ',
    quote: 'ನಿಮ್ಮ ಆರೋಗ್ಯವು ನಮ್ಮ ಆದ್ಯತೆಯಾಗಿದೆ.',
    quoteAuthor: 'ಸ್ಮಾರ್ಟ್ಹೆಲ್ತ್ AI ತಂಡ',
    aiPowered: 'AI-ಚಾಲಿತ ರೋಗನಿರ್ಣಯ',
    aiPoweredDesc: 'ರೋಗ ಮುನ್ಸೂಚನೆಯಲ್ಲಿ 99% ನಿಖರತೆ',
    securePlatform: 'ಸುರಕ್ಷಿತ ವೇದಿಕೆ',
    securePlatformDesc: 'HIPAA ಅನುಸರಣೆ ಡೇಟಾ ರಕ್ಷಣೆ',
    fastService: '24/7 ಲಭ್ಯತೆ',
    fastServiceDesc: 'ದಿನದ 24 ಗಂಟೆ ವೈದ್ಯಕೀಯ ಬೆಂಬಲ',
    trustedCare: 'ವಿಶ್ವಾಸಾರ್ಹ ಆರೈಕೆ',
    trustedCareDesc: 'ಪ್ರಮಾಣೀಕೃತ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರು',
  },
  te: {
    welcome: 'తిరిగి స్వాగతం',
    tagline: 'స్మార్ట్ AI ఆరోగ్య సంరక్షణ ఇక్కడ ప్రారంభమవుతుంది',
    description: 'ఆరోగ్య సంరక్షణ పంపిణీని మార్చడానికి AI-శక్తితో కూడిన వైద్య వేదిక',
    bookConsultation: 'ఉచిత సంప్రదింపు బుక్ చేయండి',
    watchDemo: 'డెమో చూడండి',
    features: 'మా ఫీచర్లు',
    whyChooseUs: 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి',
    symptomChecker: 'లక్షణ పరీక్ష',
    symptomDesc: 'AI-శక్తితో కూడిన వ్యాధి అంచనా',
    aiChat: 'AI చాట్ సహాయకుడు',
    aiChatDesc: 'తక్షణ ఆరోగ్య మార్గదర్శకత్వం పొందండి',
    appointments: 'అపాయింట్మెంట్లు',
    appointmentsDesc: 'సంప్రదింపులను షెడ్యూల్ చేయండి',
    medicalRecords: 'వైద్య రికార్డులు',
    recordsDesc: 'సురక్షిత ఆరోగ్య రికార్డులు',
    predictionHistory: 'అంచనా చరిత్ర',
    historyDesc: 'గత విశ్లేషణలను చూడండి',
    connectDoctor: 'వైద్యులతో కనెక్ట్ అవ్వండి',
    videoConsult: 'వీడియో సంప్రదింపు',
    phoneConsult: 'ఫోన్ సంప్రదింపు',
    scheduleAppt: 'అపాయింట్మెంట్ షెడ్యూల్ చేయండి',
    emergency: 'వైద్య అత్యవసరం?',
    emergencyDesc: 'అత్యవసర పరిస్థితులకు, వెంటనే 108కి కాల్ చేయండి',
    quote: 'మీ ఆరోగ్యం మా ప్రాధాన్యత.',
    quoteAuthor: 'స్మార్ట్హెల్త్ AI టీమ్',
    aiPowered: 'AI-శక్తితో కూడిన నిర్ధారణ',
    aiPoweredDesc: 'వ్యాధి అంచనాలో 99% ఖచ్చితత్వం',
    securePlatform: 'సురక్షిత వేదిక',
    securePlatformDesc: 'HIPAA అనుగుణ డేటా రక్షణ',
    fastService: '24/7 లభ్యత',
    fastServiceDesc: 'రౌండ్-ది-క్లాక్ వైద్య మద్దతు',
    trustedCare: 'విశ్వసనీయ సంరక్షణ',
    trustedCareDesc: 'ప్రమాణీకృత ఆరోగ్య నిపుణులు',
  },
  ta: {
    welcome: 'மீண்டும் வரவேற்கிறோம்',
    tagline: 'புத்திசாலித்தனமான AI சுகாதாரம் இங்கே தொடங்குகிறது',
    description: 'சுகாதார விநியோகத்தை மாற்ற AI-இயங்கும் மருத்துவ தளம்',
    bookConsultation: 'இலவச ஆலோசனை பதிவு செய்யுங்கள்',
    watchDemo: 'டெமோ பாருங்கள்',
    features: 'எங்கள் அம்சங்கள்',
    whyChooseUs: 'ஏன் எங்களை தேர்வு செய்ய வேண்டும்',
    symptomChecker: 'அறிகுறி சோதனை',
    symptomDesc: 'AI-இயங்கும் நோய் கணிப்பு',
    aiChat: 'AI அரட்டை உதவியாளர்',
    aiChatDesc: 'உடனடி சுகாதார வழிகாட்டுதல் பெறுங்கள்',
    appointments: 'சந்திப்புகள்',
    appointmentsDesc: 'ஆலோசனைகளை திட்டமிடுங்கள்',
    medicalRecords: 'மருத்துவ பதிவுகள்',
    recordsDesc: 'பாதுகாப்பான சுகாதார பதிவுகள்',
    predictionHistory: 'கணிப்பு வரலாறு',
    historyDesc: 'கடந்த பகுப்பாய்வுகளைப் பார்க்கவும்',
    connectDoctor: 'மருத்துவர்களுடன் இணைக்கவும்',
    videoConsult: 'வீடியோ ஆலோசனை',
    phoneConsult: 'தொலைபேசி ஆலோசனை',
    scheduleAppt: 'சந்திப்பு திட்டமிடுங்கள்',
    emergency: 'மருத்துவ அவசரம்?',
    emergencyDesc: 'அவசர சூழ்நிலைகளுக்கு, உடனடியாக 108ஐ அழைக்கவும்',
    quote: 'உங்கள் சுகாதாரம் எங்கள் முன்னுரிமை.',
    quoteAuthor: 'ஸ்மார்ட்ஹெல்த் AI குழு',
    aiPowered: 'AI-இயங்கும் நோயறிதல்',
    aiPoweredDesc: 'நோய் கணிப்பில் 99% துல்லியம்',
    securePlatform: 'பாதுகாப்பான தளம்',
    securePlatformDesc: 'HIPAA இணக்க தரவு பாதுகாப்பு',
    fastService: '24/7 கிடைக்கும்',
    fastServiceDesc: 'சுற்றி-கடிகார மருத்துவ ஆதரவு',
    trustedCare: 'நம்பகமான பராமரிப்பு',
    trustedCareDesc: 'சான்றளிக்கப்பட்ட சுகாதார நிபுணர்கள்',
  },
  hi: {
    welcome: 'वापसी पर स्वागत है',
    tagline: 'स्मार्ट AI स्वास्थ्य सेवा यहाँ से शुरू होती है',
    description: 'स्वास्थ्य सेवा वितरण को बदलने के लिए AI-संचालित चिकित्सा मंच',
    bookConsultation: 'मुफ्त परामर्श बुक करें',
    watchDemo: 'डेमो देखें',
    features: 'हमारी विशेषताएं',
    whyChooseUs: 'हमें क्यों चुनें',
    symptomChecker: 'लक्षण जांचकर्ता',
    symptomDesc: 'AI-संचालित रोग पूर्वानुमान',
    aiChat: 'AI चैट सहायक',
    aiChatDesc: 'तत्काल स्वास्थ्य मार्गदर्शन प्राप्त करें',
    appointments: 'अपॉइंटमेंट',
    appointmentsDesc: 'परामर्श शेड्यूल करें',
    medicalRecords: 'चिकित्सा रिकॉर्ड',
    recordsDesc: 'सुरक्षित स्वास्थ्य रिकॉर्ड',
    predictionHistory: 'पूर्वानुमान इतिहास',
    historyDesc: 'पिछले विश्लेषण देखें',
    connectDoctor: 'डॉक्टरों से जुड़ें',
    videoConsult: 'वीडियो परामर्श',
    phoneConsult: 'फोन परामर्श',
    scheduleAppt: 'अपॉइंटमेंट शेड्यूल करें',
    emergency: 'चिकित्सा आपातकाल?',
    emergencyDesc: 'आपातकालीन स्थितियों के लिए, तुरंत 102 पर कॉल करें',
    quote: 'आपका स्वास्थ्य हमारी प्राथमिकता है।',
    quoteAuthor: 'स्मार्टहेल्थ AI टीम',
    aiPowered: 'AI-संचालित निदान',
    aiPoweredDesc: 'रोग पूर्वानुमान में 99% सटीकता',
    securePlatform: 'सुरक्षित मंच',
    securePlatformDesc: 'HIPAA अनुपालन डेटा सुरक्षा',
    fastService: '24/7 उपलब्धता',
    fastServiceDesc: 'चौबीसों घंटे चिकित्सा सहायता',
    trustedCare: 'भरोसेमंद देखभाल',
    trustedCareDesc: 'प्रमाणित स्वास्थ्य पेशेवर',
  },
  ml: {
    welcome: 'തിരികെ സ്വാഗതം',
    tagline: 'സ്മാർട്ട് AI ആരോഗ്യ സംരക്ഷണം ഇവിടെ ആരംഭിക്കുന്നു',
    description: 'ആരോഗ്യ സംരക്ഷണ വിതരണം പരിവർത്തനം ചെയ്യാൻ AI-പ്രവർത്തിക്കുന്ന മെഡിക്കൽ പ്ലാറ്റ്ഫോം',
    bookConsultation: 'സൗജന്യ കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക',
    watchDemo: 'ഡെമോ കാണുക',
    features: 'ഞങ്ങളുടെ സവിശേഷതകൾ',
    whyChooseUs: 'ഞങ്ങളെ എന്തുകൊണ്ട് തിരഞ്ഞെടുക്കണം',
    symptomChecker: 'ലക്ഷണ പരിശോധന',
    symptomDesc: 'AI-പ്രവർത്തിക്കുന്ന രോഗ പ്രവചനം',
    aiChat: 'AI ചാറ്റ് അസിസ്റ്റന്റ്',
    aiChatDesc: 'തൽക്ഷണ ആരോഗ്യ മാർഗ്ഗനിർദ്ദേശം നേടുക',
    appointments: 'അപ്പോയിന്റ്മെന്റുകൾ',
    appointmentsDesc: 'കൺസൾട്ടേഷനുകൾ ഷെഡ്യൂൾ ചെയ്യുക',
    medicalRecords: 'മെഡിക്കൽ റെക്കോർഡുകൾ',
    recordsDesc: 'സുരക്ഷിത ആരോഗ്യ റെക്കോർഡുകൾ',
    predictionHistory: 'പ്രവചന ചരിത്രം',
    historyDesc: 'മുൻ വിശകലനങ്ങൾ കാണുക',
    connectDoctor: 'ഡോക്ടർമാരുമായി ബന്ധപ്പെടുക',
    videoConsult: 'വീഡിയോ കൺസൾട്ടേഷൻ',
    phoneConsult: 'ഫോൺ കൺസൾട്ടേഷൻ',
    scheduleAppt: 'അപ്പോയിന്റ്മെന്റ് ഷെഡ്യൂൾ ചെയ്യുക',
    emergency: 'മെഡിക്കൽ എമർജൻസി?',
    emergencyDesc: 'അടിയന്തര സാഹചര്യങ്ങൾക്ക്, ഉടൻ 102 വിളിക്കുക',
    quote: 'നിങ്ങളുടെ ആരോഗ്യം ഞങ്ങളുടെ മുൻഗണനയാണ്.',
    quoteAuthor: 'സ്മാർട്ട്ഹെൽത്ത് AI ടീം',
    aiPowered: 'AI-പ്രവർത്തിക്കുന്ന രോഗനിർണയം',
    aiPoweredDesc: 'രോഗ പ്രവചനത്തിൽ 99% കൃത്യത',
    securePlatform: 'സുരക്ഷിത പ്ലാറ്റ്ഫോം',
    securePlatformDesc: 'HIPAA അനുയോജ്യമായ ഡാറ്റ സംരക്ഷണം',
    fastService: '24/7 ലഭ്യത',
    fastServiceDesc: 'റൗണ്ട്-ദി-ക്ലോക്ക് മെഡിക്കൽ പിന്തുണ',
    trustedCare: 'വിശ്വസനീയ പരിചരണം',
    trustedCareDesc: 'സർട്ടിഫൈഡ് ആരോഗ്യ പ്രൊഫഷണലുകൾ',
  },
};

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
];

// AI Doctor SVG Component
const AIDoctorSVG = () => (
  <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
      </linearGradient>
      <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff' }} />
        <stop offset="100%" style={{ stopColor: '#e8f0fe' }} />
      </linearGradient>
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FDBCB4' }} />
        <stop offset="100%" style={{ stopColor: '#E8937A' }} />
      </linearGradient>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1d4ed8' }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
      </linearGradient>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ef4444' }} />
        <stop offset="100%" style={{ stopColor: '#dc2626' }} />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
      </filter>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="200" cy="250" r="190" fill="url(#bgGrad)" />
    <g opacity="0.15">
      <circle cx="50" cy="100" r="25" fill="#3b82f6" />
      <text x="50" y="108" textAnchor="middle" fontSize="20" fill="white">+</text>
      <circle cx="350" cy="150" r="20" fill="#ef4444" />
      <text x="350" y="157" textAnchor="middle" fontSize="16" fill="white">♥</text>
      <circle cx="60" cy="380" r="18" fill="#1d4ed8" />
      <text x="60" y="386" textAnchor="middle" fontSize="13" fill="white">⚕</text>
    </g>
    <ellipse cx="200" cy="430" rx="110" ry="80" fill="url(#coatGrad)" filter="url(#shadow)" />
    <path d="M155 310 L200 340 L245 310 L255 500 L145 500 Z" fill="#dbeafe" />
    <path d="M175 310 L200 340 L225 310" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
    <path d="M140 300 L100 320 L90 500 L165 500 L165 380 L200 400 L235 380 L235 500 L310 500 L300 320 L260 300 Z" fill="url(#coatGrad)" filter="url(#shadow)" />
    <circle cx="200" cy="360" r="4" fill="#93c5fd" />
    <circle cx="200" cy="385" r="4" fill="#93c5fd" />
    <circle cx="200" cy="410" r="4" fill="#93c5fd" />
    <path d="M155 320 Q140 340 145 360 Q150 380 165 385 Q185 392 190 375 Q195 358 180 350 Q165 342 160 355" fill="none" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
    <circle cx="160" cy="357" r="10" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2" />
    <circle cx="160" cy="357" r="5" fill="#93c5fd" />
    <path d="M155 320 L148 310 M155 320 L152 308" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
    <rect x="183" y="245" width="34" height="45" rx="15" fill="url(#skinGrad)" />
    <ellipse cx="200" cy="210" rx="58" ry="68" fill="url(#skinGrad)" filter="url(#shadow)" />
    <path d="M148 185 Q150 140 200 135 Q250 130 255 185 Q250 160 200 158 Q152 160 148 185 Z" fill="#1a1a2e" />
    <path d="M148 185 Q142 175 145 160 Q148 148 155 145" fill="none" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" />
    <path d="M252 185 Q258 175 255 160 Q252 148 245 145" fill="none" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" />
    <ellipse cx="143" cy="210" rx="10" ry="14" fill="url(#skinGrad)" />
    <ellipse cx="257" cy="210" rx="10" ry="14" fill="url(#skinGrad)" />
    <ellipse cx="180" cy="205" rx="10" ry="11" fill="white" />
    <ellipse cx="220" cy="205" rx="10" ry="11" fill="white" />
    <circle cx="182" cy="207" r="7" fill="#1a1a2e" />
    <circle cx="222" cy="207" r="7" fill="#1a1a2e" />
    <circle cx="184" cy="204" r="2.5" fill="white" />
    <circle cx="224" cy="204" r="2.5" fill="white" />
    <path d="M170 193 Q180 188 192 192" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M210 192 Q220 188 232 193" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M197 215 Q195 225 192 228 Q196 230 200 229 Q204 230 208 228 Q205 225 203 215 Z" fill="#E8937A" opacity="0.6" />
    <path d="M186 242 Q200 254 214 242" stroke="#c0705a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M186 242 Q200 260 214 242" fill="#ff9f9f" opacity="0.4" />
    <rect x="220" y="320" width="60" height="40" rx="5" fill="url(#blueGrad)" />
    <rect x="224" y="324" width="52" height="32" rx="3" fill="white" opacity="0.9" />
    <circle cx="240" cy="333" r="6" fill="#93c5fd" />
    <rect x="250" y="329" width="22" height="3" rx="1.5" fill="#1d4ed8" opacity="0.5" />
    <rect x="250" y="335" width="16" height="2" rx="1" fill="#93c5fd" opacity="0.5" />
    <text x="250" y="350" fontSize="6" fill="#1d4ed8" fontWeight="bold">MD, AIIMS</text>
    <rect x="100" y="340" width="50" height="65" rx="6" fill="#1e3a8a" filter="url(#shadow)" />
    <rect x="104" y="344" width="42" height="57" rx="4" fill="#dbeafe" />
    <rect x="108" y="350" width="34" height="2" rx="1" fill="#3b82f6" opacity="0.7" />
    <rect x="108" y="356" width="28" height="2" rx="1" fill="#3b82f6" opacity="0.5" />
    <rect x="108" y="362" width="32" height="2" rx="1" fill="#3b82f6" opacity="0.5" />
    <path d="M108 375 L114 375 L117 368 L120 382 L123 372 L126 375 L142 375" fill="none" stroke="#ef4444" strokeWidth="1.5" />
    <g filter="url(#shadow)">
      <rect x="280" y="260" width="100" height="55" rx="12" fill="white" />
      <text x="290" y="280" fontSize="9" fill="#6b7280">Heart Rate</text>
      <text x="290" y="298" fontSize="18" fontWeight="bold" fill="#ef4444">72</text>
      <text x="316" y="298" fontSize="9" fill="#6b7280">bpm</text>
      <path d="M290 310 L298 310 L301 304 L304 316 L307 308 L310 310 L320 310" fill="none" stroke="#ef4444" strokeWidth="1.5" />
    </g>
    <g filter="url(#glow)">
      <circle cx="320" cy="200" r="4" fill="#60a5fa" opacity="0.8" />
      <circle cx="80" cy="250" r="3" fill="#3b82f6" opacity="0.6" />
      <circle cx="330" cy="350" r="5" fill="#93c5fd" opacity="0.7" />
    </g>
    <g transform="translate(320, 90)" filter="url(#shadow)">
      <rect x="-18" y="-6" width="36" height="12" rx="6" fill="#ef4444" />
      <rect x="-6" y="-18" width="12" height="36" rx="6" fill="#ef4444" />
      <circle cx="0" cy="0" r="22" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.3" />
    </g>
  </svg>
);

// Animated heartbeat line component
const HeartbeatLine = () => (
  <Box sx={{ overflow: 'hidden', height: 40, display: 'flex', alignItems: 'center' }}>
    <svg viewBox="0 0 300 40" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M0 20 L40 20 L55 20 L65 5 L75 35 L85 10 L95 30 L105 20 L145 20 L160 20 L170 5 L180 35 L190 10 L200 30 L210 20 L300 20"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 600,
          strokeDashoffset: 600,
          animation: 'drawLine 3s ease forwards infinite',
        }}
      />
      <style>{`
        @keyframes drawLine {
          0% { stroke-dashoffset: 600; opacity: 1; }
          70% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
      `}</style>
    </svg>
  </Box>
);

export default function Home() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRefs = {
    home: useRef(null),
    features: useRef(null),
    why: useRef(null),
    doctors: useRef(null),
    emergency: useRef(null),
  };

useEffect(() => {
  if (!isLoading && !user) {
    // TEMP: don't redirect (avoid 404)
    console.log('User not logged in');
  }
}, [user, isLoading]);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const scrollToSection = (section) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 3,
      }}>
        <Box sx={{ position: 'relative' }}>
          <CircularProgress size={80} thickness={2} sx={{ color: 'rgba(255,255,255,0.3)' }} variant="determinate" value={100} />
          <CircularProgress size={80} thickness={2} sx={{ color: 'white', position: 'absolute', left: 0, top: 0, animationDuration: '1.5s' }} />
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, letterSpacing: 2 }}>
          LOADING SMARTHEALTH AI
        </Typography>
        <LinearProgress sx={{ width: 200, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
      </Box>
    );
  }

  if (!user) return null;

  const t = translations[language];

  const navItems = [
    { label: 'Home', section: 'home' },
    { label: 'Features', section: 'features' },
    { label: 'Why Us', section: 'why' },
    { label: 'Doctors', section: 'doctors' },
    { label: 'Emergency', section: 'emergency' },
  ];

  const features = [
    {
      title: t.symptomChecker,
      description: t.symptomDesc,
      icon: <LocalHospital sx={{ fontSize: 36 }} />,
      path: '/symptom-checker',
      color: '#1d4ed8',
      lightColor: '#dbeafe',
      stats: '500K+ checks',
    },
    {
      title: t.aiChat,
      description: t.aiChatDesc,
      icon: <Chat sx={{ fontSize: 36 }} />,
      path: '/chat',
      color: '#2563eb',
      lightColor: '#eff6ff',
      stats: '24/7 Active',
    },
    {
      title: t.appointments,
      description: t.appointmentsDesc,
      icon: <CalendarMonth sx={{ fontSize: 36 }} />,
      path: '/appointments',
      color: '#dc2626',
      lightColor: '#fef2f2',
      stats: '10K+ Doctors',
    },
    {
      title: t.medicalRecords,
      description: t.recordsDesc,
      icon: <FolderShared sx={{ fontSize: 36 }} />,
      path: '/records',
      color: '#1e40af',
      lightColor: '#dbeafe',
      stats: 'HIPAA Secure',
    },
    {
      title: t.predictionHistory,
      description: t.historyDesc,
      icon: <History sx={{ fontSize: 36 }} />,
      path: '/history',
      color: '#b91c1c',
      lightColor: '#fef2f2',
      stats: 'AI Analytics',
    },
    {
      title: 'Health Monitor',
      description: 'Real-time vitals tracking',
      icon: <MonitorHeart sx={{ fontSize: 36 }} />,
      path: '/monitor',
      color: '#1d4ed8',
      lightColor: '#eff6ff',
      stats: 'Live Tracking',
    },
  ];

  const doctorServices = [
    {
      title: t.videoConsult,
      icon: <VideoCall sx={{ fontSize: 44 }} />,
      color: '#1d4ed8',
      description: 'HD video calls with specialists',
      tag: 'Most Popular',
    },
    {
      title: t.phoneConsult,
      icon: <Phone sx={{ fontSize: 44 }} />,
      color: '#dc2626',
      description: 'Instant voice consultation',
      tag: 'Fastest',
    },
    {
      title: t.scheduleAppt,
      icon: <Schedule sx={{ fontSize: 44 }} />,
      color: '#1e40af',
      description: 'Plan your visit in advance',
      tag: 'Flexible',
    },
  ];

  const whyUs = [
    {
      icon: <Healing sx={{ fontSize: 40 }} />,
      title: t.aiPowered,
      description: t.aiPoweredDesc,
      color: '#1d4ed8',
      value: '99%',
      label: 'Accuracy',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: t.securePlatform,
      description: t.securePlatformDesc,
      color: '#dc2626',
      value: '256-bit',
      label: 'Encryption',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: t.fastService,
      description: t.fastServiceDesc,
      color: '#1e40af',
      value: '<2min',
      label: 'Response',
    },
    {
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: t.trustedCare,
      description: t.trustedCareDesc,
      color: '#b91c1c',
      value: '50K+',
      label: 'Patients',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faff', fontFamily: '"Plus Jakarta Sans", "Nunito", sans-serif' }}>

      {/* TOP APPBAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #0f1f5c 0%, #1d3a8a 50%, #1a237e 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ py: 1.5, justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(239,68,68,0.4)',
            }}>
              <HealthAndSafety sx={{ color: 'white', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                SmartHealth AI
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', letterSpacing: 1 }}>
                MEDICAL INTELLIGENCE
              </Typography>
            </Box>
          </Box>

          {/* Center Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
                sx={{
                  color: activeSection === item.section ? 'white' : 'rgba(255,255,255,0.7)',
                  fontWeight: activeSection === item.section ? 700 : 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  position: 'relative',
                  bgcolor: activeSection === item.section ? 'rgba(255,255,255,0.12)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
                  '&::after': activeSection === item.section ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: '#ef4444',
                  } : {},
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Controls */}
          <Box display="flex" alignItems="center" gap={1.5}>
            {/* Language */}
            <FormControl size="small">
              <Select
                value={language}
                onChange={handleLanguageChange}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
                  fontSize: '0.8rem',
                  minWidth: 110,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                }}
                startAdornment={<Language sx={{ mr: 0.5, color: 'rgba(255,255,255,0.7)', fontSize: 16 }} />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code} sx={{ fontSize: '0.85rem' }}>
                    {lang.flag} {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User menu */}
            <Box
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: '10px',
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
                transition: 'all 0.2s',
              }}
            >
              <Avatar sx={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                width: 32, height: 32,
                fontWeight: 700,
                fontSize: '0.875rem',
              }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="body2" fontWeight={600} sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}>
                {user?.name || 'Guest'}
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                },
              }}
            >
              <MenuItem onClick={() => { setAnchorEl(null); router.push('/profile'); }} sx={{ py: 1.5, borderRadius: '8px', mx: 1, mt: 0.5 }}>
                <Person sx={{ mr: 2, color: '#1d4ed8' }} /> Profile Settings
              </MenuItem>
              <MenuItem onClick={logout} sx={{ color: '#dc2626', py: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}>
                <Logout sx={{ mr: 2 }} /> Sign Out
              </MenuItem>
            </Menu>

            {/* Mobile menu toggle */}
            <IconButton
              sx={{ display: { md: 'none' }, color: 'white' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <Box sx={{ bgcolor: '#0f1f5c', py: 2, px: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {navItems.map((item) => (
              <Button
                key={item.section}
                fullWidth
                onClick={() => scrollToSection(item.section)}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'rgba(255,255,255,0.85)',
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </AppBar>

      {/* HERO SECTION */}
      <Box
        ref={sectionRefs.home}
        sx={{
          background: 'linear-gradient(135deg, #0f1f5c 0%, #1d3a8a 40%, #1e40af 70%, #2563eb 100%)',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { md: '90vh' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background decorations */}
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
          <Box sx={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <Box sx={{ position: 'absolute', top: '20%', left: '5%', width: 12, height: 12, borderRadius: '50%', bgcolor: '#60a5fa', opacity: 0.6, animation: 'float 4s ease-in-out infinite', '@keyframes float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } }} />
          <Box sx={{ position: 'absolute', top: '60%', left: '8%', width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444', opacity: 0.5, animation: 'float 5s ease-in-out infinite 1s' }} />
          <Box sx={{ position: 'absolute', top: '30%', right: '12%', width: 10, height: 10, borderRadius: '50%', bgcolor: '#93c5fd', opacity: 0.6, animation: 'float 3.5s ease-in-out infinite 0.5s' }} />
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            {/* LEFT: Text content */}
            <Grid item xs={12} md={5}>
              <Chip
                icon={<Star sx={{ fontSize: '14px !important', color: '#fbbf24 !important' }} />}
                label="India's #1 AI Healthcare Platform"
                sx={{
                  bgcolor: 'rgba(251,191,36,0.12)',
                  color: '#fbbf24',
                  fontWeight: 600,
                  border: '1px solid rgba(251,191,36,0.3)',
                  mb: 3,
                  fontSize: '0.8rem',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  mb: 2.5,
                  lineHeight: 1.15,
                  fontSize: { xs: '2.2rem', md: '3rem', lg: '3.5rem' },
                  letterSpacing: '-1px',
                }}
              >
                {t.tagline}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.7,
                  fontSize: '1rem',
                }}
              >
                {t.description}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <HeartbeatLine />
              </Box>
              <Paper sx={{
                p: 3,
                mb: 4,
                borderRadius: '20px',
                bgcolor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <Box display="flex" gap={2} alignItems="flex-start">
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '10px',
                    bgcolor: 'rgba(239,68,68,0.2)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FormatQuote sx={{ color: '#ef4444', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', mb: 1, fontWeight: 400, lineHeight: 1.6 }}>
                      "{t.quote}"
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#93c5fd', fontWeight: 700, letterSpacing: 0.5 }}>
                      — {t.quoteAuthor}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => router.push('/symptom-checker')}
                  sx={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.6,
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 25px rgba(239,68,68,0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      boxShadow: '0 12px 35px rgba(239,68,68,0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {t.bookConsultation}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<VideoCall />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.6,
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    borderWidth: 1.5,
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': {
                      borderWidth: 1.5,
                      bgcolor: 'rgba(255,255,255,0.12)',
                      borderColor: 'rgba(255,255,255,0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {t.watchDemo}
                </Button>
              </Box>
              <Box display="flex" gap={3} mt={4} flexWrap="wrap">
                {[
                  { icon: <CheckCircle sx={{ fontSize: 16, color: '#4ade80' }} />, text: 'HIPAA Certified' },
                  { icon: <CheckCircle sx={{ fontSize: 16, color: '#4ade80' }} />, text: 'ISO 27001' },
                  { icon: <CheckCircle sx={{ fontSize: 16, color: '#4ade80' }} />, text: '50K+ Patients' },
                ].map((badge, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={0.7}>
                    {badge.icon}
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.78rem' }}>
                      {badge.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* CENTER: AI Doctor */}
            <Grid item xs={12} md={4}>
              <Box sx={{
                position: 'relative',
                height: { xs: 350, md: 520 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Box sx={{
                  position: 'absolute',
                  width: '70%',
                  height: '70%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  top: '15%',
                  left: '15%',
                }} />
                <Box sx={{
                  position: 'absolute', inset: 0,
                  border: '1px dashed rgba(255,255,255,0.07)',
                  borderRadius: '50%',
                  animation: 'spin 30s linear infinite',
                  '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
                }} />
                <Box sx={{
                  position: 'absolute', inset: '10%',
                  border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: '50%',
                  animation: 'spin 20s linear infinite reverse',
                }} />
                <AIDoctorSVG />
              </Box>
            </Grid>

            {/* RIGHT: Stats panel */}
            <Grid item xs={12} md={3}>
              <Box display="flex" flexDirection="column" gap={2.5}>
                {[
                  { label: 'Patients Served', value: '50,000+', icon: <Favorite sx={{ fontSize: 20 }} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
                  { label: 'Accuracy Rate', value: '99.2%', icon: <TrendingUp sx={{ fontSize: 20 }} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
                  { label: 'Doctors Online', value: '1,200+', icon: <MedicalServices sx={{ fontSize: 20 }} />, color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
                  { label: 'Avg Response', value: '< 2 min', icon: <Speed sx={{ fontSize: 20 }} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      bgcolor: stat.bg,
                      border: `1px solid ${stat.border}`,
                      borderRadius: '16px',
                      p: 2.5,
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateX(4px)' },
                    }}
                  >
                    <Box sx={{
                      width: 42, height: 42, borderRadius: '12px',
                      bgcolor: stat.bg, border: `1px solid ${stat.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: stat.color, flexShrink: 0,
                    }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Box sx={{
                  bgcolor: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  borderRadius: '14px',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box sx={{
                    width: 10, height: 10, borderRadius: '50%', bgcolor: '#4ade80',
                    boxShadow: '0 0 0 0 rgba(74,222,128,0.4)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 rgba(74,222,128,0.5)' }, '70%': { boxShadow: '0 0 0 10px rgba(74,222,128,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(74,222,128,0)' } },
                  }} />
                  <Typography variant="body2" sx={{ color: '#4ade80', fontWeight: 600, fontSize: '0.8rem' }}>
                    1,247 doctors available now
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* WELCOME BAND */}
      <Box sx={{ bgcolor: '#fff', py: 2.5, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#0f1f5c' }}>
              {t.welcome}, <span style={{ color: '#1d4ed8' }}>{user.name}</span>! 👋
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology'].map((spec) => (
                <Chip
                  key={spec}
                  label={spec}
                  size="small"
                  sx={{
                    bgcolor: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    border: '1px solid #bfdbfe',
                    '&:hover': { bgcolor: '#dbeafe', cursor: 'pointer' },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>

        {/* WHY CHOOSE US */}
        <Box ref={sectionRefs.why} mb={10}>
          <Box mb={5} textAlign="center">
            <Chip label="Our Advantages" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 600, mb: 2, border: '1px solid #bfdbfe' }} />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#0f1f5c' }}>
              {t.whyChooseUs}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {whyUs.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  borderRadius: '24px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  height: '100%',
                  p: 1,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    borderColor: item.color,
                    boxShadow: `0 20px 50px ${item.color}20`,
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 70, height: 70, borderRadius: '18px',
                      background: `linear-gradient(135deg, ${item.color}15, ${item.color}25)`,
                      border: `2px solid ${item.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mb: 2.5, color: item.color,
                    }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h3" fontWeight={900} sx={{ color: item.color, mb: 0.5, lineHeight: 1 }}>
                      {item.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#0f1f5c', mt: 1.5, mb: 0.75, fontSize: '1rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FEATURES GRID */}
        <Box ref={sectionRefs.features} mb={10}>
          <Box mb={5} textAlign="center">
            <Chip label="Platform Tools" sx={{ bgcolor: '#fef2f2', color: '#dc2626', fontWeight: 600, mb: 2, border: '1px solid #fecaca' }} />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#0f1f5c' }}>
              {t.features}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => router.push(feature.path)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '24px',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 50px ${feature.color}25`,
                      borderColor: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                      <Box sx={{
                        width: 64, height: 64, borderRadius: '18px',
                        bgcolor: feature.lightColor,
                        border: `1.5px solid ${feature.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: feature.color,
                      }}>
                        {feature.icon}
                      </Box>
                      <Chip
                        label={feature.stats}
                        size="small"
                        sx={{
                          bgcolor: feature.lightColor,
                          color: feature.color,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          border: `1px solid ${feature.color}20`,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#0f1f5c' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ color: feature.color }}>
                      <Typography variant="body2" fontWeight={700} fontSize="0.82rem">Explore feature</Typography>
                      <ArrowForward sx={{ fontSize: 16 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CONNECT WITH DOCTORS */}
        <Box ref={sectionRefs.doctors} mb={10}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0f1f5c 0%, #1d3a8a 60%, #1e40af 100%)',
              borderRadius: '32px',
              p: { xs: 4, md: 7 },
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
            <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />

            <Box textAlign="center" mb={6} sx={{ position: 'relative', zIndex: 1 }}>
              <Chip label="Expert Care" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#93c5fd', fontWeight: 600, mb: 2, border: '1px solid rgba(255,255,255,0.15)' }} />
              <Typography variant="h4" fontWeight={800} sx={{ color: 'white', mb: 1.5 }}>
                {t.connectDoctor}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Connect with certified specialists instantly through multiple channels
              </Typography>
            </Box>

            <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
              {doctorServices.map((service, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: '24px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.12)',
                      transform: 'translateY(-8px)',
                      border: `1px solid ${service.color}60`,
                      boxShadow: `0 20px 50px ${service.color}25`,
                    },
                  }}>
                    <Chip
                      label={service.tag}
                      size="small"
                      sx={{
                        mb: 3,
                        bgcolor: service.color === '#dc2626' ? 'rgba(239,68,68,0.15)' : 'rgba(29,78,216,0.15)',
                        color: service.color === '#dc2626' ? '#fca5a5' : '#93c5fd',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        border: `1px solid ${service.color}30`,
                      }}
                    />
                    <Box sx={{
                      width: 90, height: 90, borderRadius: '50%',
                      bgcolor: `${service.color}20`,
                      border: `2px solid ${service.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 24px', color: service.color === '#dc2626' ? '#fca5a5' : '#93c5fd',
                    }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', mb: 3 }}>
                      {service.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)' },
                      }}
                    >
                      Get Started
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Featured doctors row */}
            <Box mt={6} pt={5} sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', mb: 3, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.72rem', fontWeight: 600 }}>
                Featured Specialists Available Now
              </Typography>
              <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
                {[
                  { name: 'Dr. Ananya R.', specialty: 'Cardiologist', rating: '4.9', initial: 'A', color: '#60a5fa' },
                  { name: 'Dr. Vikram S.', specialty: 'Neurologist', rating: '4.8', initial: 'V', color: '#34d399' },
                  { name: 'Dr. Priya M.', specialty: 'Pediatrician', rating: '5.0', initial: 'P', color: '#f472b6' },
                  { name: 'Dr. Rahul K.', specialty: 'Dermatologist', rating: '4.7', initial: 'R', color: '#fbbf24' },
                ].map((doc, i) => (
                  <Box key={i} sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '14px',
                    px: 2.5, py: 1.5, border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'scale(1.03)' },
                  }}>
                    <Avatar sx={{ bgcolor: doc.color + '30', color: doc.color, fontWeight: 700, width: 38, height: 38, border: `2px solid ${doc.color}40`, fontSize: '0.9rem' }}>
                      {doc.initial}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700} sx={{ color: 'white', fontSize: '0.82rem' }}>{doc.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>{doc.specialty}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.3}>
                      <Star sx={{ fontSize: 12, color: '#fbbf24' }} />
                      <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.75rem' }}>{doc.rating}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* AI HEALTH INSIGHTS SECTION */}
        <Box mb={10}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={5}>
              <Card sx={{
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
                border: '1.5px solid #fecaca',
                height: '100%',
                p: 4,
              }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MonitorHeart sx={{ color: '#ef4444', fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#0f1f5c' }}>AI Health Score</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Updated just now</Typography>
                  </Box>
                </Box>
                {[
                  { label: 'Cardiovascular Health', value: 87, color: '#ef4444' },
                  { label: 'Mental Wellness', value: 72, color: '#1d4ed8' },
                  { label: 'Immune System', value: 91, color: '#4ade80' },
                  { label: 'Metabolic Health', value: 65, color: '#fbbf24' },
                ].map((metric, i) => (
                  <Box key={i} mb={2.5}>
                    <Box display="flex" justifyContent="space-between" mb={0.8}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#374151', fontSize: '0.82rem' }}>{metric.label}</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: metric.color }}>{metric.value}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={metric.value}
                      sx={{
                        height: 8, borderRadius: 4,
                        bgcolor: `${metric.color}15`,
                        '& .MuiLinearProgress-bar': { bgcolor: metric.color, borderRadius: 4 },
                      }}
                    />
                  </Box>
                ))}
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card sx={{
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1.5px solid #bfdbfe',
                height: '100%',
                p: 4,
              }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Psychology sx={{ color: '#1d4ed8', fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#0f1f5c' }}>AI Health Insights</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Personalized recommendations</Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  {[
                    { title: '💧 Hydration Alert', desc: 'Drink 2 more glasses of water today to meet your daily goal.', tag: 'Daily Goal' },
                    { title: '🏃 Activity Reminder', desc: "You're 1,200 steps away from your daily target. Keep moving!", tag: 'Exercise' },
                    { title: '💊 Medication', desc: 'Evening medication reminder: Vitamin D3 & Omega-3.', tag: 'Health' },
                    { title: '😴 Sleep Quality', desc: 'Maintain 7-8 hours of sleep for optimal immune function.', tag: 'Wellness' },
                  ].map((tip, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{
                        bgcolor: 'white',
                        borderRadius: '16px',
                        p: 2.5,
                        border: '1px solid #dbeafe',
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: '0 8px 25px rgba(29,78,216,0.1)', transform: 'translateY(-3px)' },
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#0f1f5c' }}>{tip.title}</Typography>
                          <Chip label={tip.tag} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 600, height: 20 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block' }}>{tip.desc}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* EMERGENCY BANNER */}
        <Box ref={sectionRefs.emergency}>
          <Box sx={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)',
            borderRadius: '28px',
            p: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
            <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
            <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  width: 90, height: 90, borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse 2s infinite',
                }}>
                  <LocalHospital sx={{ fontSize: 50, color: 'white' }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" fontWeight={900} sx={{ color: 'white', mb: 1 }}>
                  {t.emergency}
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                  {t.emergencyDesc}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    bgcolor: 'white', color: '#dc2626', fontWeight: 800,
                    px: 4, py: 1.5, borderRadius: '14px', textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#fef2f2', transform: 'scale(1.03)' },
                    transition: 'all 0.2s', boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  Call 108 Now
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>

      {/* FOOTER */}
      <Box sx={{ bgcolor: '#0f1f5c', py: 6, mt: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} mb={4}>
            {/* Brand Column */}
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HealthAndSafety sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>SmartHealth AI</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, mb: 3, maxWidth: 280 }}>
                India's leading AI-powered healthcare platform. Transforming medical care with cutting-edge technology and compassionate service.
              </Typography>
              <Box display="flex" gap={1.5}>
                {['HIPAA', 'ISO 27001', 'NHA'].map((cert) => (
                  <Chip
                    key={cert}
                    label={cert}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <Typography variant="body2" fontWeight={700} sx={{ color: 'white', mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                Platform
              </Typography>
              {['Symptom Checker', 'AI Chat', 'Appointments', 'Medical Records', 'Health Monitor'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.45)',
                    mb: 1.2,
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#93c5fd' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Company */}
            <Grid item xs={6} md={2}>
              <Typography variant="body2" fontWeight={700} sx={{ color: 'white', mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                Company
              </Typography>
              {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.45)',
                    mb: 1.2,
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#93c5fd' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Support */}
            <Grid item xs={6} md={2}>
              <Typography variant="body2" fontWeight={700} sx={{ color: 'white', mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                Support
              </Typography>
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.45)',
                    mb: 1.2,
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#93c5fd' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={6} md={2}>
              <Typography variant="body2" fontWeight={700} sx={{ color: 'white', mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                Emergency
              </Typography>
              <Box sx={{ bgcolor: 'rgba(239,68,68,0.1)', borderRadius: '12px', p: 2, border: '1px solid rgba(239,68,68,0.2)' }}>
                <Typography variant="body2" sx={{ color: '#fca5a5', fontWeight: 700, mb: 0.5 }}>
                  🚨 Emergency
                </Typography>
                <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 900 }}>108</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                  Ambulance Service
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(29,78,216,0.1)', borderRadius: '12px', p: 2, border: '1px solid rgba(29,78,216,0.2)', mt: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#93c5fd', fontWeight: 700, mb: 0.5 }}>
                  📞 Support
                </Typography>
                <Typography variant="body1" sx={{ color: '#60a5fa', fontWeight: 800 }}>1800-XXX</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                  24/7 Helpline
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Footer Bottom */}
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                © {new Date().getFullYear()} SmartHealth AI. All rights reserved. Made with ❤️ in India.
              </Typography>
              <Box display="flex" gap={2}>
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <Typography
                    key={item}
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.35)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      '&:hover': { color: 'rgba(255,255,255,0.7)' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(29,78,216,0.4)',
            zIndex: 1000,
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 35px rgba(29,78,216,0.5)',
            },
          }}
        >
          <KeyboardArrowUp sx={{ color: 'white', fontSize: 28 }} />
        </Box>
      )}
    </Box>
  );
}