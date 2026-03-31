"""
AWS Lambda Function - AI Chat
Provides conversational health assistance using AI
"""

import json
from datetime import datetime

def get_ai_response(message, conversation_history):
    """
    Generate AI response based on user message
    In production, replace with OpenAI API or AWS Bedrock
    """
    
    message_lower = message.lower()
    
    # Health-related responses
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
        return {
            'message': 'Hello! 👋 I\'m your SmartHealth AI assistant. How can I help you today? You can ask me about symptoms, diseases, or general health questions.',
            'type': 'greeting'
        }
    
    elif any(word in message_lower for word in ['symptom', 'feel', 'experiencing', 'having']):
        return {
            'message': 'I can help you understand your symptoms. Please describe what you\'re experiencing, and I\'ll provide relevant information. For a detailed analysis, please use our Symptom Checker tool. 🔍',
            'type': 'symptom_inquiry',
            'suggestion': 'Use Symptom Checker for detailed analysis'
        }
    
    elif any(word in message_lower for word in ['fever', 'temperature', 'hot']):
        return {
            'message': 'Fever is often a sign that your body is fighting an infection. 🤒\n\nNormal body temperature: ~98.6°F (37°C)\nFever: Above 100.4°F (38°C)\n\n⚠️ Seek immediate care if:\n- Fever above 103°F (39.4°C)\n- Lasts more than 3 days\n- Accompanied by severe symptoms\n\nTreatment:\n- Rest and stay hydrated\n- Over-the-counter fever reducers\n- Monitor temperature regularly',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['headache', 'head pain', 'migraine']):
        return {
            'message': 'Headaches can have many causes:\n\n💡 Common Types:\n- Tension headaches (stress, poor posture)\n- Migraines (severe, often with nausea)\n- Cluster headaches (intense, one-sided)\n\n🏥 When to see a doctor:\n- Sudden, severe headache\n- Frequent or worsening headaches\n- With fever, stiff neck, or confusion\n\n💊 Relief:\n- Rest in a quiet, dark room\n- Stay hydrated\n- Over-the-counter pain relievers\n- Identify and avoid triggers',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['cough', 'coughing']):
        return {
            'message': 'Coughs help clear your airways. 😷\n\n🔍 Types:\n- Dry cough (no mucus)\n- Wet cough (produces phlegm)\n- Chronic cough (lasts 8+ weeks)\n\n🏥 See a doctor if:\n- Cough lasts more than 3 weeks\n- Produces blood\n- With high fever or difficulty breathing\n- Severe chest pain\n\n💊 Home remedies:\n- Drink plenty of fluids\n- Use humidifier\n- Honey (for adults)\n- Avoid irritants (smoke, dust)',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['diabetes', 'blood sugar', 'glucose']):
        return {
            'message': 'Diabetes is a chronic condition affecting blood sugar regulation. 📊\n\n📌 Types:\n- Type 1: Body doesn\'t produce insulin\n- Type 2: Body doesn\'t use insulin properly\n- Gestational: During pregnancy\n\n⚕️ Management:\n- Regular blood sugar monitoring\n- Healthy diet (low sugar, balanced carbs)\n- Regular exercise\n- Medication as prescribed\n- Regular doctor check-ups\n\n⚠️ Warning signs:\n- Excessive thirst/urination\n- Unexplained weight loss\n- Blurred vision\n- Slow-healing wounds',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['covid', 'coronavirus', 'covid-19']):
        return {
            'message': 'COVID-19 information: 😷\n\n🦠 Common symptoms:\n- Fever or chills\n- Cough\n- Fatigue\n- Loss of taste/smell\n- Difficulty breathing\n\n🏥 When to seek care:\n- Difficulty breathing\n- Persistent chest pain\n- Confusion\n- Bluish lips/face\n\n💊 Prevention:\n- Vaccination\n- Mask in crowded areas\n- Hand hygiene\n- Physical distancing when sick\n\n📞 For testing and treatment, contact your healthcare provider.',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['flu', 'influenza']):
        return {
            'message': 'Influenza (Flu) information: 🤧\n\n🦠 Symptoms:\n- High fever (100-104°F)\n- Body aches\n- Fatigue\n- Cough\n- Sore throat\n- Headache\n\n⏱️ Duration: Usually 5-7 days\n\n💊 Treatment:\n- Rest and fluids\n- Antiviral medications (within 48 hours)\n- Over-the-counter symptom relief\n\n🛡️ Prevention:\n- Annual flu vaccine\n- Hand hygiene\n- Avoid close contact with sick people',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['hypertension', 'high blood pressure', 'bp']):
        return {
            'message': 'High Blood Pressure (Hypertension): 💓\n\n📊 Normal ranges:\n- Normal: Less than 120/80 mmHg\n- Elevated: 120-129/<80 mmHg\n- High: 130/80 mmHg or higher\n\n⚕️ Management:\n- Reduce salt intake\n- Regular exercise (30 min/day)\n- Maintain healthy weight\n- Limit alcohol\n- Manage stress\n- Take medications as prescribed\n\n🏥 Monitor regularly and consult your doctor for personalized treatment plan.',
            'type': 'health_info'
        }
    
    elif any(word in message_lower for word in ['emergency', 'urgent', '911', 'chest pain', 'cant breathe']):
        return {
            'message': '🚨 MEDICAL EMERGENCY 🚨\n\nIf you\'re experiencing:\n- Chest pain or pressure\n- Difficulty breathing\n- Severe bleeding\n- Loss of consciousness\n- Stroke symptoms (FAST):\n  F - Face drooping\n  A - Arm weakness\n  S - Speech difficulty\n  T - Time to call 911\n\n📞 CALL EMERGENCY SERVICES (911) IMMEDIATELY\n\nDo NOT wait for online advice in emergencies!',
            'type': 'emergency_alert'
        }
    
    elif any(word in message_lower for word in ['thank', 'thanks', 'appreciate']):
        return {
            'message': 'You\'re very welcome! 😊 Remember, I provide general health information only. For personalized medical advice, always consult with qualified healthcare professionals.\n\nIs there anything else I can help you with?',
            'type': 'acknowledgment'
        }
    
    elif any(word in message_lower for word in ['help', 'what can you do', 'how to use']):
        return {
            'message': 'I\'m here to help! 🤖 Here\'s what I can do:\n\n✅ Answer general health questions\n✅ Explain common symptoms\n✅ Provide disease information\n✅ Suggest when to see a doctor\n✅ Share preventive health tips\n\n🔍 For symptom analysis, use our Symptom Checker\n📊 For your health history, check the History tab\n\n💡 Just ask me any health-related question!',
            'type': 'help'
        }
    
    elif any(word in message_lower for word in ['medicine', 'medication', 'drug', 'prescription']):
        return {
            'message': '💊 About Medications:\n\nI can provide general information about common medications, but I cannot:\n❌ Prescribe medications\n❌ Recommend specific dosages\n❌ Suggest starting/stopping medications\n\n✅ Always consult your doctor or pharmacist for:\n- Prescription medications\n- Dosage information\n- Drug interactions\n- Side effects concerns\n\n⚠️ Never start, stop, or change medications without medical advice.',
            'type': 'medication_info'
        }
    
    elif any(word in message_lower for word in ['allergy', 'allergies', 'allergic']):
        return {
            'message': 'Allergies occur when your immune system reacts to substances. 🤧\n\n🌼 Common allergens:\n- Pollen, dust, pet dander\n- Foods (nuts, shellfish, dairy)\n- Insect stings\n- Medications\n\n😷 Symptoms:\n- Sneezing, runny nose\n- Itchy eyes/skin\n- Hives or rash\n- Swelling\n\n🏥 Severe allergic reaction (Anaphylaxis):\n- Difficulty breathing\n- Swelling of throat/tongue\n- Rapid pulse\n- Dizziness\n➡️ Use EpiPen if available and CALL 911\n\n💊 Management:\n- Avoid known allergens\n- Antihistamines\n- Allergy testing\n- Immunotherapy',
            'type': 'health_info'
        }
    
    else:
        # Default response for unrecognized queries
        return {
            'message': 'I understand you have a health question. While I can provide general health information, I\'m not a substitute for professional medical advice. 👨‍⚕️\n\nFor specific health concerns, please:\n- Use our Symptom Checker for analysis\n- Consult with a healthcare provider\n- Call your doctor for personalized advice\n\nFeel free to ask me general health questions, and I\'ll do my best to help! 💙',
            'type': 'general_response'
        }

def lambda_handler(event, context):
    """Main Lambda handler for chat"""
    
    print(f"Received event: {json.dumps(event)}")
    
    try:
        # Parse request
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        message = body.get('message', '')
        user_id = body.get('userId', 'anonymous')
        conversation_history = body.get('history', [])
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                'body': json.dumps({'error': 'Message is required'})
            }
        
        # Generate response
        ai_response = get_ai_response(message, conversation_history)
        
        # Add metadata
        response_data = {
            'response': ai_response['message'],
            'type': ai_response.get('type', 'general'),
            'suggestion': ai_response.get('suggestion'),
            'timestamp': datetime.utcnow().isoformat(),
            'disclaimer': '⚠️ For informational purposes only. Not a substitute for professional medical advice.'
        }
        
        print(f"Generated response for user {user_id}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }