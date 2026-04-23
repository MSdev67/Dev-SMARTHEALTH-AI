// web/src/app/appointments/phone/page.tsx
'use client';

import { useState } from 'react';
import { initiatePhoneCall } from '@/services/consultation';
import toast from 'react-hot-toast';

type PhoneState = 'idle' | 'connecting' | 'waiting' | 'connected' | 'error';

export default function PhoneConsultationPage() {
  const [state, setState] = useState<PhoneState>('idle');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callInfo, setCallInfo] = useState<{ callSid: string; estimatedWait: number } | null>(null);
  const [waitTime, setWaitTime] = useState(0);

  const PATIENT_ID = 'patient_123';
  const DOCTOR_ID = 'doctor_456';

  const startCall = async () => {
    if (!phoneNumber.match(/^\+?[\d\s\-]{10,15}$/)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    try {
      setState('connecting');
      const result = await initiatePhoneCall(PATIENT_ID, phoneNumber, DOCTOR_ID);
      setCallInfo({ callSid: result.callSid, estimatedWait: result.estimatedWait });
      setWaitTime(result.estimatedWait);
      setState('waiting');
      toast.success('Doctor will call you shortly!');

      // Poll status every 5s
      const interval = setInterval(async () => {
        setWaitTime(w => {
          if (w <= 5) { clearInterval(interval); setState('connected'); return 0; }
          return w - 5;
        });
      }, 5000);
    } catch {
      setState('error');
      toast.error('Failed to initiate call. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f4e] to-[#2d3a8c] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-8 text-center">Phone Consultation</h1>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          {state === 'idle' && (
            <>
              <div className="w-20 h-20 bg-red-400/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-blue-200 text-center mb-6">Enter your phone number and we'll connect you instantly</p>
              <label className="block text-blue-200 text-sm mb-2">Your phone number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 mb-6 outline-none focus:border-blue-400"
              />
              <button
                onClick={startCall}
                className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-3 rounded-full transition-all"
              >
                Connect Now
              </button>
            </>
          )}

          {state === 'connecting' && (
            <div className="text-center py-6">
              <div className="animate-spin w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white">Connecting you to a doctor...</p>
            </div>
          )}

          {state === 'waiting' && (
            <div className="text-center py-6">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping" />
                <div className="relative w-24 h-24 bg-red-400/40 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                  </svg>
                </div>
              </div>
              <p className="text-white text-lg font-semibold mb-2">Doctor calling you shortly</p>
              <p className="text-blue-200">Estimated wait: ~{waitTime}s</p>
              <p className="text-blue-300 text-sm mt-2">Call will arrive at {phoneNumber}</p>
            </div>
          )}

          {state === 'connected' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-500/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white text-xl font-semibold mb-2">Call Connected!</p>
              <p className="text-green-300">Check your phone — the doctor is calling</p>
              <button onClick={() => setState('idle')} className="mt-6 text-blue-300 underline text-sm">
                Start new consultation
              </button>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center py-6">
              <p className="text-white mb-4">Something went wrong</p>
              <button onClick={() => setState('idle')} className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}