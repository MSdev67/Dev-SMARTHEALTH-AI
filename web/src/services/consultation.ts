// web/src/services/consultation.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-gateway-url';

export interface VideoRoom {
  roomUrl: string;
  roomName: string;
  token: string;
  expiresAt: string;
}

export interface PhoneConsultation {
  callSid: string;
  status: string;
  estimatedWait: number;
}

export interface AppointmentBooking {
  appointmentId: string;
  doctorName: string;
  specialization: string;
  dateTime: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending';
}

// ── Video Consultation ──────────────────────────────────────────────
export async function createVideoRoom(patientId: string, doctorId: string): Promise<VideoRoom> {
  const res = await fetch(`${API_BASE}/consultations/video/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, doctorId }),
  });
  if (!res.ok) throw new Error('Failed to create video room');
  return res.json();
}

// ── Phone Consultation ──────────────────────────────────────────────
export async function initiatePhoneCall(
  patientId: string,
  patientPhone: string,
  doctorId: string
): Promise<PhoneConsultation> {
  const res = await fetch(`${API_BASE}/consultations/phone/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, patientPhone, doctorId }),
  });
  if (!res.ok) throw new Error('Failed to initiate phone call');
  return res.json();
}

// ── Schedule Appointment ────────────────────────────────────────────
export async function bookAppointment(payload: {
  patientId: string;
  doctorId: string;
  specialization: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  patientEmail: string;
}): Promise<AppointmentBooking> {
  const res = await fetch(`${API_BASE}/appointments/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to book appointment');
  return res.json();
}

export async function getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/appointments/slots?doctorId=${doctorId}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch slots');
  return res.json();
}

export async function getConsultationStatus(appointmentId: string) {
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}/status`);
  return res.json();
}