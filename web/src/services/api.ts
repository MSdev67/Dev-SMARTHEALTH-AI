// ============================================================
// SmartHealth AI — Centralized API Service Layer
// All backend communication goes through this file.
// Set NEXT_PUBLIC_API_BASE_URL in .env.local to your
// deployed API Gateway URL (e.g. https://xyz.execute-api.ap-south-1.amazonaws.com/prod)
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// ─── Generic fetch wrapper ───────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API request failed');
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterPayload) =>
    apiFetch<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => apiFetch<User>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    apiFetch<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Symptom Checker ─────────────────────────────────────────
export const symptomAPI = {
  analyzeSymptoms: (symptoms: string[], age: number, gender: string) =>
    apiFetch<SymptomResult>('/symptoms/analyze', {
      method: 'POST',
      body: JSON.stringify({ symptoms, age, gender }),
    }),

  getSymptomsList: () => apiFetch<string[]>('/symptoms/list'),

  getPredictionHistory: () => apiFetch<PredictionRecord[]>('/symptoms/history'),
};

// ─── Chat ────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (messages: ChatMessage[], language = 'en') =>
    apiFetch<{ reply: string; sessionId: string }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ messages, language }),
    }),

  getChatHistory: () => apiFetch<ChatSession[]>('/chat/history'),

  clearHistory: (sessionId: string) =>
    apiFetch<{ success: boolean }>(`/chat/history/${sessionId}`, {
      method: 'DELETE',
    }),
};

// ─── Appointments ────────────────────────────────────────────
export const appointmentAPI = {
  bookAppointment: (data: AppointmentPayload) =>
    apiFetch<Appointment>('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAppointments: () => apiFetch<Appointment[]>('/appointments'),

  cancelAppointment: (id: string) =>
    apiFetch<{ success: boolean }>(`/appointments/${id}`, {
      method: 'DELETE',
    }),

  getDoctors: (specialty?: string) =>
    apiFetch<Doctor[]>(`/appointments/doctors${specialty ? `?specialty=${specialty}` : ''}`),

  bookVideoConsult: (data: ConsultPayload) =>
    apiFetch<{ meetingUrl: string; appointment: Appointment }>('/appointments/video', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  bookPhoneConsult: (data: ConsultPayload) =>
    apiFetch<{ phone: string; appointment: Appointment }>('/appointments/phone', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Medical Records ─────────────────────────────────────────
export const recordsAPI = {
  getRecords: () => apiFetch<MedicalRecord[]>('/records'),

  uploadRecord: (formData: FormData) =>
    fetch(`${BASE_URL}/records/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    }).then((r) => r.json()),

  deleteRecord: (id: string) =>
    apiFetch<{ success: boolean }>(`/records/${id}`, { method: 'DELETE' }),

  getRecord: (id: string) => apiFetch<MedicalRecord>(`/records/${id}`),
};

// ─── Health Monitor ──────────────────────────────────────────
export const monitorAPI = {
  saveVitals: (vitals: VitalsPayload) =>
    apiFetch<Vitals>('/monitor/vitals', {
      method: 'POST',
      body: JSON.stringify(vitals),
    }),

  getVitalsHistory: () => apiFetch<Vitals[]>('/monitor/vitals/history'),

  getLatestVitals: () => apiFetch<Vitals>('/monitor/vitals/latest'),
};

// ─── Types ───────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  phone?: string;
  bloodGroup?: string;
  allergies?: string[];
  avatar?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  phone: string;
}

export interface SymptomResult {
  predictions: Array<{
    disease: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendations: string[];
    specialistType: string;
  }>;
  disclaimer: string;
  sessionId: string;
}

export interface PredictionRecord {
  id: string;
  symptoms: string[];
  predictions: SymptomResult['predictions'];
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  title: string;
}

export interface AppointmentPayload {
  doctorId: string;
  type: 'video' | 'phone' | 'in-person';
  date: string;
  time: string;
  reason: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  type: string;
  date: string;
  time: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingUrl?: string;
}

export interface ConsultPayload {
  doctorId: string;
  preferredTime: string;
  reason: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  avatar?: string;
  available: boolean;
  fee: number;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  fileUrl?: string;
  notes?: string;
  doctor?: string;
}

export interface VitalsPayload {
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
}

export interface Vitals extends VitalsPayload {
  id: string;
  recordedAt: string;
}