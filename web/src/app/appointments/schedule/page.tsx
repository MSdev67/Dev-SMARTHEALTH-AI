// web/src/app/appointments/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { bookAppointment, getAvailableSlots } from '@/services/consultation';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

const DOCTORS = [
  { id: 'doc_1', name: 'Dr. Priya Sharma', spec: 'General Medicine' },
  { id: 'doc_2', name: 'Dr. Arjun Mehta', spec: 'Cardiology' },
  { id: 'doc_3', name: 'Dr. Sunita Rao', spec: 'Dermatology' },
];

const DATES = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

export default function ScheduleAppointmentPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{ code: string; doctorName: string } | null>(null);

  const PATIENT_ID = 'patient_123';

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    setLoading(true);
    getAvailableSlots(selectedDoctor, selectedDate)
      .then(setSlots)
      .catch(() => {
        // Fallback demo slots
        setSlots(['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM','04:00 PM']);
      })
      .finally(() => setLoading(false));
  }, [selectedDoctor, selectedDate]);

  const handleBook = async () => {
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      const doctor = DOCTORS.find(d => d.id === selectedDoctor)!;
      const result = await bookAppointment({
        patientId: PATIENT_ID,
        doctorId: selectedDoctor,
        specialization: doctor.spec,
        preferredDate: selectedDate,
        preferredTime: selectedSlot,
        reason,
        patientEmail: email,
      });
      setConfirmation({ code: result.confirmationCode, doctorName: doctor.name });
      toast.success('Appointment booked!');
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f4e] to-[#2d3a8c] flex items-center justify-center p-6">
        <div className="bg-white/10 rounded-2xl p-10 text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Confirmed!</h2>
          <p className="text-blue-200 mb-1">{confirmation.doctorName}</p>
          <p className="text-blue-200 mb-4">{selectedDate} at {selectedSlot}</p>
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <p className="text-blue-300 text-sm mb-1">Confirmation code</p>
            <p className="text-white font-mono text-xl font-bold">{confirmation.code}</p>
          </div>
          <p className="text-blue-300 text-sm">A confirmation email has been sent to {email}</p>
          <button
            onClick={() => { setConfirmation(null); setStep(1); setSelectedDoctor(''); setSelectedDate(''); setSelectedSlot(''); }}
            className="mt-6 text-blue-300 underline text-sm"
          >
            Book another appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f4e] to-[#2d3a8c] p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-2 text-center">Schedule Appointment</h1>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-2 ${s < 3 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= s ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/50'}`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-blue-500' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          {/* Step 1: Select doctor + date */}
          {step === 1 && (
            <div>
              <h2 className="text-white text-lg font-semibold mb-4">Choose a doctor</h2>
              <div className="space-y-3 mb-6">
                {DOCTORS.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all
                      ${selectedDoctor === doc.id
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'}`}
                  >
                    <p className="text-white font-semibold">{doc.name}</p>
                    <p className="text-blue-200 text-sm">{doc.spec}</p>
                  </button>
                ))}
              </div>

              <h2 className="text-white text-lg font-semibold mb-4">Select a date</h2>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {DATES.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-3 rounded-xl text-center border transition-all
                        ${selectedDate === dateStr
                          ? 'border-blue-400 bg-blue-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'}`}
                    >
                      <p className="text-blue-200 text-xs">{format(date, 'EEE')}</p>
                      <p className="text-white font-bold">{format(date, 'd')}</p>
                      <p className="text-blue-200 text-xs">{format(date, 'MMM')}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedDoctor || !selectedDate}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold py-3 rounded-full transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Choose time slot */}
          {step === 2 && (
            <div>
              <h2 className="text-white text-lg font-semibold mb-4">Available time slots</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl border text-sm transition-all
                        ${selectedSlot === slot
                          ? 'border-blue-400 bg-blue-500/20 text-white'
                          : 'border-white/20 text-blue-200 hover:border-white/40'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-white/30 text-white py-3 rounded-full hover:bg-white/10">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold py-3 rounded-full"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="text-white text-lg font-semibold mb-4">Confirm your appointment</h2>
              <div className="bg-white/10 rounded-xl p-4 mb-4 space-y-2">
                <p className="text-blue-200 text-sm">Doctor: <span className="text-white">{DOCTORS.find(d => d.id === selectedDoctor)?.name}</span></p>
                <p className="text-blue-200 text-sm">Date: <span className="text-white">{selectedDate}</span></p>
                <p className="text-blue-200 text-sm">Time: <span className="text-white">{selectedSlot}</span></p>
              </div>
              <label className="block text-blue-200 text-sm mb-2">Reason for visit</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Brief description of your concern..."
                rows={3}
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 mb-4 outline-none focus:border-blue-400 resize-none"
              />
              <label className="block text-blue-200 text-sm mb-2">Email for confirmation</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 mb-6 outline-none focus:border-blue-400"
              />
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-white/30 text-white py-3 rounded-full hover:bg-white/10">Back</button>
                <button
                  onClick={handleBook}
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-semibold py-3 rounded-full"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}