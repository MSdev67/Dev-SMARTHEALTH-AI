import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-gateway-url.amazonaws.com/dev';

class ApiService {
  private api: AxiosInstance;
  private useMock: boolean;

  constructor() {
    this.useMock = !process.env.NEXT_PUBLIC_API_URL || 
                   process.env.NEXT_PUBLIC_API_URL.includes('your-api-gateway') ||
                   API_URL.includes('your-api-gateway');
    
    console.log('API Service initialized - Mock mode:', this.useMock);
    
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private mockDelay = () => new Promise(resolve => setTimeout(resolve, 800));

  async register(data: any) {
    if (this.useMock) {
      await this.mockDelay();
      const mockUser = {
        userId: `mock-user-${Date.now()}`,
        email: data.email,
        name: data.name,
        phone: data.phone || '',
      };
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);
      return { success: true, data: { user: mockUser, token: mockToken } };
    }
    return (await this.api.post('/auth/register', data)).data;
  }

  async login(email: string, password: string) {
    if (this.useMock) {
      await this.mockDelay();
      if (email && password) {
        const mockUser = {
          userId: 'mock-user-123',
          email: email,
          name: email.split('@')[0],
          phone: '+1234567890',
        };
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);
        return { success: true, data: { user: mockUser, token: mockToken } };
      }
      throw new Error('Invalid credentials');
    }
    return (await this.api.post('/auth/login', { email, password })).data;
  }

  async getProfile() {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { user: JSON.parse(localStorage.getItem('user') || '{}') } };
    }
    return (await this.api.get('/user/profile')).data;
  }

  async updateProfile(data: any) {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { user: data } };
    }
    return (await this.api.put('/user/profile', data)).data;
  }

  async analyzeSymptoms(data: { symptoms: any[] }) {
    if (this.useMock) {
      await this.mockDelay();
      return {
        success: true,
        data: {
          predictionId: `mock-prediction-${Date.now()}`,
          predictions: [
            {
              disease: 'Common Cold',
              confidence: 0.85,
              description: 'A viral infection of the upper respiratory tract',
              recommendations: [
                'Get plenty of rest',
                'Stay hydrated with water and warm fluids',
                'Use over-the-counter cold medications if needed',
                'Gargle with salt water for sore throat',
              ],
              severity: 'low',
            },
            {
              disease: 'Influenza (Flu)',
              confidence: 0.62,
              description: 'A contagious respiratory illness caused by influenza viruses',
              recommendations: [
                'Rest at home and avoid contact with others',
                'Drink plenty of fluids',
                'Consider antiviral medication within 48 hours',
                'Monitor for complications',
              ],
              severity: 'medium',
            },
            {
              disease: 'Allergic Rhinitis',
              confidence: 0.45,
              description: 'Inflammation of the nasal airways due to allergens',
              recommendations: [
                'Identify and avoid allergens',
                'Use antihistamines as directed',
                'Keep windows closed during high pollen',
                'Consider allergy testing',
              ],
              severity: 'low',
            },
          ],
        },
      };
    }
    return (await this.api.post('/prediction/analyze', data)).data;
  }

  async getPredictionHistory() {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { predictions: [] } };
    }
    return (await this.api.get('/prediction/history')).data;
  }

  async sendMessage(data: any) {
    if (this.useMock) {
      await this.mockDelay();
      return {
        success: true,
        data: {
          chatId: 'mock-chat-123',
          userMessage: { id: '1', sender: 'user', content: data.message },
          aiMessage: {
            id: '2',
            sender: 'ai',
            content: 'This is a mock AI response.',
          },
        },
      };
    }
    return (await this.api.post('/chat/message', data)).data;
  }

  async getChatHistory(chatId: string) {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { chat: { messages: [] } } };
    }
    return (await this.api.get(`/chat/${chatId}`)).data;
  }

  async listChats() {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { chats: [] } };
    }
    return (await this.api.get('/chat')).data;
  }

  async uploadRecord(data: any) {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { record: data } };
    }
    return (await this.api.post('/records/upload', data)).data;
  }

  async getRecords(type?: string) {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { records: [] } };
    }
    return (await this.api.get('/records', { params: { type } })).data;
  }

  async createAppointment(data: any) {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { appointment: data } };
    }
    return (await this.api.post('/appointments', data)).data;
  }

  async listAppointments(filter?: string, status?: string) {
    if (this.useMock) {
      await this.mockDelay();
      return { success: true, data: { appointments: [] } };
    }
    return (await this.api.get('/appointments', { params: { filter, status } })).data;
  }
}

export default new ApiService();
