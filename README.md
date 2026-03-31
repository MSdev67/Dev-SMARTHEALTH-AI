# 🏥 SmartHealth AI - Serverless Medical Assistant

A complete AI-powered healthcare system with symptom analysis, disease prediction, and real-time chat support. Built with serverless architecture (AWS Lambda), machine learning (scikit-learn), and modern frontends (React Web + React Native Mobile).

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [ML Model Details](#ml-model-details)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- 🔍 **AI Symptom Checker** - Analyze symptoms and predict possible diseases
- 🤖 **AI Chat Assistant** - Interactive health consultation
- 📊 **Disease Prediction** - ML-powered predictions with confidence scores
- 📱 **Cross-Platform** - Web, iOS, and Android apps
- ☁️ **Serverless Architecture** - Scalable and cost-effective
- 🔒 **HIPAA-Ready** - Secure data handling and encryption
- 📈 **Consultation History** - Track your health journey
- 💬 **Real-time Chat** - Instant AI responses

### ML Features
- Ensemble model (Random Forest + Naive Bayes)
- 92.68% prediction accuracy
- 41 disease classifications
- 100+ symptom recognition
- Confidence scoring
- Severity classification (LOW/MEDIUM/HIGH)

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│     Client Applications                     │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Web App  │ iOS App  │Android   │        │
│  │ (Next.js)│ (RN)     │App (RN)  │        │
│  └─────┬────┴────┬─────┴────┬─────┘        │
└────────┼─────────┼──────────┼──────────────┘
         │         │          │
         └─────────┼──────────┘
                   │
         ┌─────────▼──────────┐
         │  API Gateway       │
         │  (AWS)             │
         └─────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐  ┌──────▼─────┐  ┌────▼─────┐
│Lambda  │  │  Lambda    │  │ Lambda   │
│Auth    │  │  Symptom   │  │ Chat     │
│        │  │  Analyzer  │  │ Service  │
└───┬────┘  └──────┬─────┘  └────┬─────┘
    │              │              │
    │              │              │
┌───▼────┐  ┌──────▼─────┐  ┌────▼─────┐
│DynamoDB│  │ S3 Bucket  │  │ ML Models│
│        │  │ (Models)   │  │ (RF + NB)│
└────────┘  └────────────┘  └──────────┘
```

## 🛠 Tech Stack

### Backend
- **AWS Lambda** - Serverless compute
- **API Gateway** - REST API management
- **DynamoDB** - NoSQL database
- **S3** - Model storage
- **Python 3.11** - Runtime
- **scikit-learn** - Machine learning
- **Serverless Framework** - Infrastructure as Code

### Frontend (Web)
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Frontend (Mobile)
- **React Native 0.73** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Routing
- **React Native Vector Icons** - Icons
- **AsyncStorage** - Local storage

### ML/AI
- **scikit-learn** - ML models
- **pandas** - Data processing
- **NumPy** - Numerical computing
- **Random Forest** - Primary classifier
- **Naive Bayes** - Secondary classifier

## 📦 Prerequisites

### System Requirements
- **macOS** 10.15+ (for iOS development)
- **Node.js** 18+
- **Python** 3.11+
- **npm** or **yarn**
- **Xcode** 14+ (for iOS)
- **Android Studio** (for Android)

### AWS Requirements
- AWS Account
- AWS CLI configured
- IAM user with permissions:
  - Lambda full access
  - API Gateway full access
  - DynamoDB full access
  - S3 full access
  - CloudFormation full access

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd smarthealth-ai
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Train ML models
python train_model.py

# Install Serverless Framework
npm install -g serverless

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
```

### 3. Web App Setup

```bash
cd smarthealth-web

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/dev" > .env.local

# Start development server
npm run dev
# App will run on http://localhost:3000
```

### 4. Mobile App Setup

```bash
cd smarthealth-mobile

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📤 Deployment

### Deploy Backend to AWS

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

This will:
1. ✅ Check prerequisites
2. ✅ Create S3 bucket for ML models
3. ✅ Upload trained models to S3
4. ✅ Deploy Lambda functions
5. ✅ Create API Gateway endpoints
6. ✅ Set up DynamoDB tables
7. ✅ Output API Gateway URL

### Update Frontend with API URL

After deployment, update the API URL in your apps:

**Web App:**
```bash
# smarthealth-web/.env.local
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

**Mobile App:**
```typescript
// smarthealth-mobile/src/services/api.ts
const API_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev';
```

### Deploy Web App (Vercel)

```bash
cd smarthealth-web

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy Mobile Apps

**iOS (App Store):**
```bash
cd smarthealth-mobile/ios

# Build archive
xcodebuild -workspace SmartHealthAI.xcworkspace \
           -scheme SmartHealthAI \
           -configuration Release \
           -archivePath build/SmartHealthAI.xcarchive \
           archive

# Upload to App Store Connect
```

**Android (Play Store):**
```bash
cd smarthealth-mobile/android

# Build release bundle
./gradlew bundleRelease

# Upload to Google Play Console
```

## 💻 Usage

### Web Application

1. **Open** http://localhost:3000 (development) or your deployed URL
2. **Select symptoms** from the categorized list
3. **Click "Analyze Symptoms"** to get AI predictions
4. **View results** with disease predictions, confidence scores, and recommendations
5. **Check consultation history** in the History tab
6. **Chat with AI** for additional health questions

### Mobile Application

1. **Launch app** on iOS or Android device
2. **Navigate** using bottom tabs:
   - **Symptom Checker** - Analyze symptoms
   - **AI Chat** - Conversational health assistant
   - **History** - View past consultations
3. **Select symptoms** and tap "Analyze"
4. **View detailed results** with recommendations

### API Testing

```bash
# Get symptoms list
curl https://your-api-url/symptoms

# Analyze symptoms
curl -X POST https://your-api-url/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["fever", "cough", "fatigue"],
    "userId": "test_user_123"
  }'

# Get consultation history
curl https://your-api-url/consultations/test_user_123

# Chat with AI
curl -X POST https://your-api-url/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are symptoms of flu?",
    "userId": "test_user_123"
  }'
```

## 📚 API Documentation

### Endpoints

#### 1. Get Symptoms
```
GET /symptoms
```

**Response:**
```json
{
  "symptoms": ["fever", "cough", ...],
  "categorized": {
    "General": [...],
    "Respiratory": [...]
  },
  "total": 100
}
```

#### 2. Analyze Symptoms
```
POST /analyze
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "fatigue"],
  "userId": "user_123"
}
```

**Response:**
```json
{
  "predictions": [
    {
      "disease": "Common Cold",
      "confidence": 85.5,
      "severity": "LOW",
      "description": "Viral infection of upper respiratory tract",
      "recommendations": [
        "Rest adequately",
        "Stay hydrated",
        "Use OTC medications if needed"
      ]
    }
  ],
  "symptoms_analyzed": ["fever", "cough", "fatigue"],
  "timestamp": "2024-01-15T10:30:00Z",
  "disclaimer": "This is NOT a medical diagnosis..."
}
```

#### 3. Get Consultations
```
GET /consultations/{userId}
```

**Response:**
```json
{
  "userId": "user_123",
  "consultations": [...],
  "count": 5
}
```

#### 4. AI Chat
```
POST /chat
Content-Type: application/json

{
  "message": "What are symptoms of flu?",
  "userId": "user_123",
  "history": []
}
```

**Response:**
```json
{
  "response": "Flu symptoms typically include...",
  "type": "health_info",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📁 Project Structure

```
smarthealth-ai/
├── backend/
│   ├── lambda_symptom_analyzer.py    # Symptom analysis Lambda
│   ├── lambda_get_consultations.py   # History retrieval
│   ├── lambda_get_symptoms.py        # Symptoms list
│   ├── lambda_chat.py                # AI chat
│   ├── train_model.py                # ML model training
│   ├── serverless.yml                # Infrastructure config
│   └── requirements.txt              # Python dependencies
│
├── smarthealth-web/                  # Next.js web app
│   ├── src/
│   │   ├── app/                      # App router pages
│   │   ├── components/               # React components
│   │   └── services/                 # API services
│   ├── package.json
│   └── next.config.js
│
├── smarthealth-mobile/               # React Native app
│   ├── src/
│   │   ├── screens/                  # App screens
│   │   ├── components/               # Reusable components
│   │   ├── navigation/               # Navigation config
│   │   └── services/                 # API services
│   ├── ios/                          # iOS native code
│   ├── android/                      # Android native code
│   └── package.json
│
├── models/                           # Trained ML models
│   ├── rf_model.pkl
│   ├── nb_model.pkl
│   ├── symptoms.json
│   └── diseases.json
│
├── disease_dataset_expanded.csv      # Training dataset
├── deploy.sh                         # Deployment script
└── README.md                         # This file
```

## 🧠 ML Model Details

### Dataset
- **Samples:** 615 symptom-disease combinations
- **Diseases:** 41 different conditions
- **Symptoms:** 100 unique symptoms
- **Augmentation:** 15x variations per disease

### Models
1. **Random Forest Classifier**
   - Estimators: 100 trees
   - Max depth: 10
   - Accuracy: 92.68%
   - CV Score: 87.40% ± 2.33%

2. **Naive Bayes Classifier**
   - Type: Multinomial
   - Alpha: 1.0
   - Accuracy: 93.50%
   - CV Score: 91.25% ± 2.38%

3. **Ensemble Method**
   - Random Forest weight: 60%
   - Naive Bayes weight: 40%
   - Combined predictions for higher accuracy

### Prediction Output
- Top 3 most likely diseases
- Confidence percentage for each
- Severity classification
- Disease descriptions
- Personalized recommendations

## 🔒 Security & Compliance

### Data Protection
- ✅ HTTPS encryption in transit
- ✅ AES-256 encryption at rest (DynamoDB)
- ✅ Secure model storage (S3)
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints

### HIPAA Considerations
- 🔐 Audit logging for all data access
- 🔐 User data isolation
- 🔐 No PII storage without consent
- 🔐 Encrypted backups
- ⚠️ **Note:** Full HIPAA compliance requires additional BAA with AWS

### Privacy
- Anonymous usage by default
- User-controlled data deletion
- Clear disclaimer on all predictions
- No third-party data sharing

## 🧪 Testing

### Run Backend Tests
```bash
pytest tests/
```

### Run Web App Tests
```bash
cd smarthealth-web
npm test
```

### Run Mobile App Tests
```bash
cd smarthealth-mobile
npm test
```

## 📊 Monitoring & Logging

### AWS CloudWatch
- Lambda execution logs
- API Gateway access logs
- Error tracking
- Performance metrics

### Custom Metrics
- Prediction accuracy tracking
- API response times
- User engagement metrics

## 💰 Cost Estimation

**Monthly costs for 10,000 active users:**
- AWS Lambda: $20-50
- DynamoDB: $25-100
- API Gateway: $15-30
- S3: $5-10
- CloudWatch: $5-15
- **Total: ~$70-205/month**

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

**IMPORTANT:** SmartHealth AI is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: support@smarthealth-ai.com
- Documentation: https://docs.smarthealth-ai.com

## 🎯 Roadmap

- [ ] Integration with wearable devices
- [ ] Multi-language support
- [ ] Advanced ML models (deep learning)
- [ ] Telemedicine video consultations
- [ ] Electronic health records integration
- [ ] Prescription management
- [ ] Lab results interpretation

---

**Built with ❤️ for better healthcare accessibility**# SmartHealth-The-Health-Companion
