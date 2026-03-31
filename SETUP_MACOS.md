# 🍎 SmartHealth AI - macOS Setup Guide

Complete step-by-step guide to set up SmartHealth AI on macOS using VS Code.

## Prerequisites Installation

### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Required Tools

```bash
# Install Node.js (includes npm)
brew install node

# Install Python 3.11
brew install python@3.11

# Install AWS CLI
brew install awscli

# Install Git (if not installed)
brew install git

# Install VS Code (if not installed)
brew install --cask visual-studio-code

# For iOS development
xcode-select --install  # Install Xcode Command Line Tools
```

### 3. Install Global npm Packages

```bash
# Serverless Framework
npm install -g serverless

# Vercel CLI (for web deployment)
npm install -g vercel

# React Native CLI
npm install -g react-native-cli

# Expo CLI (optional, for easier React Native development)
npm install -g expo-cli
```

### 4. Configure AWS CLI

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID:** (Get from AWS IAM Console)
- **AWS Secret Access Key:** (Get from AWS IAM Console)
- **Default region name:** `us-east-1`
- **Default output format:** `json`

## Project Setup

### Step 1: Create Project Directory

```bash
# Create project root
mkdir ~/SmartHealthAI
cd ~/SmartHealthAI

# Download all project files (or clone from git)
```

### Step 2: Set Up Backend

```bash
cd ~/SmartHealthAI

# Create Python virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install pandas numpy scikit-learn boto3 python-dotenv

# Train ML models
python train_model.py

# You should see:
# ✓ Model trained successfully
# ✓ Saved to models/ directory
```

### Step 3: Set Up Web Application

```bash
cd ~/SmartHealthAI/smarthealth-web

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/dev
EOF

# Start development server
npm run dev
```

**Web app will be available at:** http://localhost:3000

### Step 4: Set Up Mobile Application (iOS)

```bash
cd ~/SmartHealthAI/smarthealth-mobile

# Install dependencies
npm install

# Install iOS pods
cd ios
pod install
cd ..

# Open in Xcode (to configure signing)
open ios/SmartHealthAI.xcworkspace

# In Xcode:
# 1. Select your development team
# 2. Change bundle identifier to something unique
# 3. Close Xcode

# Run on iOS simulator
npm run ios

# Or run on connected iPhone
npm run ios --device
```

### Step 5: Set Up Mobile Application (Android)

```bash
cd ~/SmartHealthAI/smarthealth-mobile

# Make sure Android Studio is installed
# Install via: brew install --cask android-studio

# Open Android Studio
# File > Open > Select smarthealth-mobile/android

# Wait for Gradle sync to complete

# Run on Android emulator
npm run android

# Or run on connected Android device
npm run android --device
```

## VS Code Setup

### 1. Open Project in VS Code

```bash
cd ~/SmartHealthAI
code .
```

### 2. Install Recommended Extensions

In VS Code, press `Cmd+Shift+P` and search for "Extensions: Install Extensions"

Install these extensions:
- **Python** (Microsoft)
- **Pylance** (Microsoft)
- **ESLint** (Microsoft)
- **Prettier** (Prettier)
- **ES7+ React/Redux/React-Native** snippets
- **Tailwind CSS IntelliSense**
- **AWS Toolkit**
- **React Native Tools**

### 3. Configure VS Code Settings

Create `.vscode/settings.json`:

```bash
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "smarthealth-web/node_modules/typescript/lib",
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true,
    "**/node_modules": true,
    "**/.next": true
  }
}
EOF
```

### 4. VS Code Terminal Setup

Open integrated terminal: `Cmd+`` (backtick)

You can create multiple terminals for:
1. **Backend** - Python/Serverless
2. **Web** - Next.js dev server
3. **Mobile** - React Native packager

## Deployment

### Deploy to AWS

```bash
cd ~/SmartHealthAI

# Activate virtual environment
source venv/bin/activate

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

**Expected output:**
```
✓ All prerequisites met
✓ S3 bucket created
✓ ML models uploaded
✓ Serverless backend deployed successfully

API Gateway URL: https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
```

### Update Apps with Production API

**Web App:**
```bash
cd smarthealth-web

# Update .env.local
echo "NEXT_PUBLIC_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev" > .env.local

# Deploy to Vercel
vercel --prod
```

**Mobile App:**
```typescript
// Edit: smarthealth-mobile/src/services/api.ts
const API_URL = 'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev';
```

Then rebuild and redeploy the mobile apps.

## Testing the Complete System

### 1. Test Backend API

```bash
# Test symptoms endpoint
curl https://your-api-url/symptoms

# Test analyze endpoint
curl -X POST https://your-api-url/analyze \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough"], "userId": "test_user"}'
```

### 2. Test Web App

```bash
cd smarthealth-web
npm run dev
```

Open http://localhost:3000:
1. Select symptoms
2. Click "Analyze Symptoms"
3. View predictions
4. Check History tab
5. Try AI Chat

### 3. Test Mobile App

```bash
cd smarthealth-mobile

# iOS
npm run ios

# Android
npm run android
```

Test all features:
1. Symptom Checker
2. AI Chat
3. History

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
cd smarthealth-web  # or smarthealth-mobile
rm -rf node_modules package-lock.json
npm install
```

### Issue: iOS build fails

**Solution:**
```bash
cd smarthealth-mobile/ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Issue: Python import errors

**Solution:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: AWS deployment fails

**Solution:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Reconfigure if needed
aws configure

# Try deployment again
./deploy.sh
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
cd smarthealth-web
PORT=3001 npm run dev
```

## Development Workflow

### Daily Development

```bash
# Terminal 1 - Backend (if testing locally)
cd ~/SmartHealthAI
source venv/bin/activate
# Make changes to Lambda functions

# Terminal 2 - Web App
cd ~/SmartHealthAI/smarthealth-web
npm run dev

# Terminal 3 - Mobile App
cd ~/SmartHealthAI/smarthealth-mobile
npm start
```

### Making Changes

1. **Backend Changes:**
   - Edit Lambda functions
   - Test locally (optional: use `serverless offline`)
   - Deploy: `serverless deploy`

2. **Web Changes:**
   - Edit files in `src/`
   - Hot reload will update automatically
   - Build: `npm run build`

3. **Mobile Changes:**
   - Edit files in `src/`
   - Reload: Press `R` in Metro bundler
   - Rebuild native: Stop and `npm run ios/android`

## Useful Commands

```bash
# Backend
serverless deploy              # Deploy all
serverless deploy function -f analyzeSymptoms  # Deploy single function
serverless logs -f analyzeSymptoms -t  # View logs
serverless remove              # Remove all AWS resources

# Web
npm run dev                    # Development
npm run build                  # Production build
npm start                      # Run production build

# Mobile
npm run ios                    # Run iOS
npm run android                # Run Android
npm start                      # Start Metro bundler
npm run lint                   # Check code quality

# AWS
aws s3 ls s3://smarthealth-ml-models-dev/  # List S3 files
aws dynamodb scan --table-name SmartHealth-Consultations-dev  # View DB
aws logs tail /aws/lambda/smarthealth-api-dev-analyzeSymptoms --follow  # Live logs
```

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all features locally
3. ✅ Deploy backend to AWS
4. ✅ Deploy web app to Vercel
5. ✅ Test production deployment
6. ✅ Submit mobile apps to stores

## Resources

- **AWS Documentation:** https://docs.aws.amazon.com/
- **Next.js Docs:** https://nextjs.org/docs
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Serverless Docs:** https://www.serverless.com/framework/docs
- **scikit-learn:** https://scikit-learn.org/stable/

## Support

If you encounter issues:
1. Check the README.md
2. Review error messages carefully
3. Check AWS CloudWatch logs
4. Verify all environment variables
5. Ensure all dependencies are installed

---

**Happy Coding! 🚀**