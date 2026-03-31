// ML Prediction Service with built-in disease dataset
// No external ML libraries required - uses rule-based matching

interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

interface Disease {
  name: string;
  commonSymptoms: string[];
  rareSymptoms: string[];
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
}

// Comprehensive Disease Knowledge Base
const DISEASE_DATABASE: Disease[] = [
  {
    name: 'Common Cold',
    commonSymptoms: ['runny nose', 'sore throat', 'cough', 'sneezing', 'mild headache', 'fatigue'],
    rareSymptoms: ['fever', 'body aches'],
    severity: 'low',
    description: 'A viral infection of the upper respiratory tract, typically mild and self-limiting.',
    recommendations: [
      'Get plenty of rest (7-9 hours of sleep)',
      'Stay well-hydrated with water, herbal tea, and warm liquids',
      'Use over-the-counter medications for symptom relief if needed',
      'Gargle with warm salt water for sore throat',
      'Use a humidifier to ease congestion',
      'Wash hands frequently to prevent spread',
    ],
  },
  {
    name: 'Influenza (Flu)',
    commonSymptoms: ['fever', 'cough', 'sore throat', 'body aches', 'headache', 'fatigue', 'chills'],
    rareSymptoms: ['nausea', 'vomiting', 'diarrhea'],
    severity: 'medium',
    description: 'A contagious respiratory illness caused by influenza viruses, more severe than common cold.',
    recommendations: [
      'Rest at home and avoid contact with others for at least 24 hours after fever subsides',
      'Drink plenty of fluids to prevent dehydration',
      'Consider antiviral medication if within 48 hours of symptom onset',
      'Monitor for complications such as difficulty breathing or chest pain',
      'Use fever reducers as directed by healthcare provider',
      'Seek medical attention if symptoms worsen or persist beyond 7 days',
    ],
  },
  {
    name: 'Allergic Rhinitis',
    commonSymptoms: ['runny nose', 'sneezing', 'itchy eyes', 'nasal congestion'],
    rareSymptoms: ['cough', 'fatigue', 'headache'],
    severity: 'low',
    description: 'Inflammation of the nasal airways due to allergens such as pollen, dust, or pet dander.',
    recommendations: [
      'Identify and avoid known allergens when possible',
      'Use antihistamines as directed for symptom relief',
      'Keep windows closed during high pollen seasons',
      'Consider air purifiers for indoor allergens',
      'Consult an allergist for allergy testing and immunotherapy options',
      'Use saline nasal rinses to clear allergens from nasal passages',
    ],
  },
  {
    name: 'Acute Bronchitis',
    commonSymptoms: ['cough', 'mucus production', 'chest discomfort', 'fatigue', 'shortness of breath'],
    rareSymptoms: ['fever', 'wheezing'],
    severity: 'medium',
    description: 'Inflammation of the bronchial tubes, often following a cold or respiratory infection.',
    recommendations: [
      'Get plenty of rest to help your body fight the infection',
      'Drink warm fluids to help loosen mucus',
      'Use a humidifier to ease breathing',
      'Avoid smoking and secondhand smoke',
      'Take over-the-counter cough suppressants if recommended',
      'See a doctor if symptoms persist beyond 3 weeks or worsen',
    ],
  },
  {
    name: 'Gastroenteritis',
    commonSymptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'cramping'],
    rareSymptoms: ['fever', 'headache', 'body aches'],
    severity: 'medium',
    description: 'Inflammation of the stomach and intestines, commonly caused by viral or bacterial infection.',
    recommendations: [
      'Stay hydrated with clear fluids, oral rehydration solutions',
      'Avoid solid foods until vomiting stops',
      'Gradually reintroduce bland foods (BRAT diet: bananas, rice, applesauce, toast)',
      'Wash hands thoroughly to prevent spread',
      'Seek medical attention if unable to keep fluids down or signs of dehydration appear',
      'Rest and avoid strenuous activity',
    ],
  },
  {
    name: 'Migraine',
    commonSymptoms: ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound'],
    rareSymptoms: ['vomiting', 'visual disturbances', 'dizziness'],
    severity: 'medium',
    description: 'A neurological condition characterized by intense, debilitating headaches.',
    recommendations: [
      'Rest in a quiet, dark room',
      'Apply cold or warm compress to head or neck',
      'Take prescribed migraine medication as early as possible',
      'Stay hydrated',
      'Identify and avoid migraine triggers (certain foods, stress, lack of sleep)',
      'Keep a headache diary to track patterns',
      'Consult a neurologist for persistent or severe migraines',
    ],
  },
  {
    name: 'Sinusitis',
    commonSymptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'headache'],
    rareSymptoms: ['fever', 'cough', 'fatigue', 'toothache'],
    severity: 'medium',
    description: 'Inflammation or infection of the sinuses, often following a cold or allergies.',
    recommendations: [
      'Use saline nasal irrigation to flush sinuses',
      'Apply warm compresses to face to relieve pressure',
      'Stay well-hydrated to thin mucus',
      'Use a humidifier to keep air moist',
      'Take over-the-counter pain relievers and decongestants as needed',
      'See a doctor if symptoms persist beyond 10 days or worsen',
    ],
  },
  {
    name: 'Strep Throat',
    commonSymptoms: ['severe sore throat', 'pain when swallowing', 'fever', 'swollen lymph nodes'],
    rareSymptoms: ['headache', 'nausea', 'vomiting', 'rash'],
    severity: 'medium',
    description: 'Bacterial infection of the throat and tonsils caused by Streptococcus bacteria.',
    recommendations: [
      'See a doctor for throat culture and possible antibiotic prescription',
      'Complete the full course of antibiotics even if feeling better',
      'Gargle with warm salt water for relief',
      'Stay hydrated with warm liquids',
      'Use throat lozenges or pain relievers for discomfort',
      'Rest and avoid spreading infection to others',
    ],
  },
  {
    name: 'Pneumonia',
    commonSymptoms: ['cough', 'fever', 'chills', 'shortness of breath', 'chest pain', 'fatigue'],
    rareSymptoms: ['confusion', 'rapid heartbeat', 'bluish lips'],
    severity: 'high',
    description: 'Infection that inflames air sacs in one or both lungs, which may fill with fluid.',
    recommendations: [
      'Seek immediate medical attention - antibiotics or antivirals may be needed',
      'Get plenty of rest',
      'Stay hydrated',
      'Take all prescribed medications as directed',
      'Use a humidifier to ease breathing',
      'Monitor oxygen levels if advised by doctor',
      'Call 911 if experiencing severe difficulty breathing or chest pain',
    ],
  },
  {
    name: 'Urinary Tract Infection (UTI)',
    commonSymptoms: ['painful urination', 'frequent urination', 'urgency', 'lower abdominal pain'],
    rareSymptoms: ['fever', 'back pain', 'bloody urine', 'cloudy urine'],
    severity: 'medium',
    description: 'Infection in any part of the urinary system, most commonly the bladder.',
    recommendations: [
      'See a doctor for urine test and antibiotic prescription',
      'Drink plenty of water to help flush bacteria',
      'Urinate frequently and completely empty bladder',
      'Avoid irritants like caffeine, alcohol, and spicy foods',
      'Use a heating pad for lower abdominal discomfort',
      'Seek immediate care if experiencing fever, chills, or back pain (signs of kidney infection)',
    ],
  },
];

class MLPredictionService {
  private diseases: Disease[] = DISEASE_DATABASE;

  /**
   * Analyze symptoms and return disease predictions with confidence scores
   */
  analyzeSymptoms(symptoms: Symptom[]): Array<{
    disease: string;
    confidence: number;
    description: string;
    recommendations: string[];
    severity: string;
  }> {
    if (!symptoms || symptoms.length === 0) {
      throw new Error('No symptoms provided');
    }

    // Normalize symptom names
    const normalizedSymptoms = symptoms.map(s => ({
      ...s,
      name: s.name.toLowerCase().trim(),
    }));

    const predictions = this.diseases.map(disease => {
      const score = this.calculateConfidence(normalizedSymptoms, disease);
      return {
        disease: disease.name,
        confidence: score,
        description: disease.description,
        recommendations: disease.recommendations,
        severity: disease.severity,
      };
    });

    // Sort by confidence and return top predictions
    return predictions
      .filter(p => p.confidence > 0.1) // Only return predictions with >10% confidence
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Return top 5 predictions
  }

  /**
   * Calculate confidence score based on symptom matching
   */
  private calculateConfidence(symptoms: Symptom[], disease: Disease): number {
    let score = 0;
    let maxScore = 0;

    // Check common symptoms
    for (const commonSymptom of disease.commonSymptoms) {
      maxScore += 10;
      const match = symptoms.find(s => 
        s.name.includes(commonSymptom) || commonSymptom.includes(s.name)
      );
      
      if (match) {
        score += 10;
        
        // Bonus for severity match
        if (disease.severity === 'high' && match.severity === 'severe') {
          score += 2;
        } else if (disease.severity === 'medium' && match.severity === 'moderate') {
          score += 1;
        }
      }
    }

    // Check rare symptoms (lower weight)
    for (const rareSymptom of disease.rareSymptoms) {
      maxScore += 3;
      const match = symptoms.find(s =>
        s.name.includes(rareSymptom) || rareSymptom.includes(s.name)
      );
      
      if (match) {
        score += 3;
      }
    }

    // Penalty for symptoms not in the disease profile
    const unmatchedSymptoms = symptoms.filter(symptom => {
      const matchesCommon = disease.commonSymptoms.some(ds =>
        symptom.name.includes(ds) || ds.includes(symptom.name)
      );
      const matchesRare = disease.rareSymptoms.some(ds =>
        symptom.name.includes(ds) || ds.includes(symptom.name)
      );
      return !matchesCommon && !matchesRare;
    });

    const penalty = unmatchedSymptoms.length * 2;
    score = Math.max(0, score - penalty);

    // Normalize to 0-1 range
    return maxScore > 0 ? Math.min(1, score / maxScore) : 0;
  }

  /**
   * Get disease information by name
   */
  getDiseaseInfo(diseaseName: string): Disease | null {
    return this.diseases.find(d => 
      d.name.toLowerCase() === diseaseName.toLowerCase()
    ) || null;
  }

  /**
   * Get all available diseases in the knowledge base
   */
  getAllDiseases(): string[] {
    return this.diseases.map(d => d.name);
  }
}

export default MLPredictionService;