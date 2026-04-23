// web/src/app/appointments/video/page.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { createVideoRoom } from '@/services/consultation';
import toast from 'react-hot-toast';

type CallState = 'idle' | 'joining' | 'in-call' | 'ended' | 'error';

export default function VideoConsultationPage() {
  const callFrameRef = useRef<ReturnType<typeof DailyIframe.createFrame> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const [roomInfo, setRoomInfo] = useState<{ roomUrl: string; token: string } | null>(null);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Replace with real auth context values
  const PATIENT_ID = 'patient_123';
  const DOCTOR_ID = 'doctor_456';

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const formatDuration = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const joinCall = useCallback(async () => {
    try {
      setCallState('joining');
      const room = await createVideoRoom(PATIENT_ID, DOCTOR_ID);
      setRoomInfo({ roomUrl: room.roomUrl, token: room.token });

      if (!containerRef.current) return;

      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px',
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });
      callFrameRef.current = frame;

      frame.on('joined-meeting', () => {
        setCallState('in-call');
        startTimer();
        toast.success('Connected to doctor!');
      });

      frame.on('left-meeting', () => {
        setCallState('ended');
        stopTimer();
      });

      frame.on('error', () => {
        setCallState('error');
        toast.error('Connection error. Please retry.');
      });

      await frame.join({ url: room.roomUrl, token: room.token });
    } catch {
      setCallState('error');
      toast.error('Could not connect. Please try again.');
    }
  }, [startTimer, stopTimer]);

  const leaveCall = useCallback(async () => {
    await callFrameRef.current?.leave();
    callFrameRef.current?.destroy();
    callFrameRef.current = null;
    stopTimer();
    setCallState('ended');
  }, [stopTimer]);

  useEffect(() => () => {
    callFrameRef.current?.destroy();
    stopTimer();
  }, [stopTimer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f4e] to-[#2d3a8c] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">Video Consultation</h1>

        {/* Video frame container */}
        <div
          ref={containerRef}
          className="w-full bg-[#0f1635] rounded-xl overflow-hidden mb-4"
          style={{ height: callState === 'in-call' ? '560px' : '0' }}
        />

        {/* Pre-join UI */}
        {callState === 'idle' && (
          <div className="bg-white/10 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Ready to connect?</h2>
            <p className="text-blue-200 mb-6">You'll be connected to a certified specialist via HD video</p>
            <button
              onClick={joinCall}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all"
            >
              Start Video Call
            </button>
          </div>
        )}

        {callState === 'joining' && (
          <div className="bg-white/10 rounded-xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white">Connecting to your doctor...</p>
          </div>
        )}

        {callState === 'in-call' && (
          <div className="flex items-center justify-between bg-white/10 rounded-xl px-6 py-3">
            <span className="text-green-400 font-mono text-lg">● {formatDuration(duration)}</span>
            <button onClick={leaveCall} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all">
              End Call
            </button>
          </div>
        )}

        {callState === 'ended' && (
          <div className="bg-white/10 rounded-xl p-8 text-center">
            <p className="text-white text-xl mb-4">Consultation ended</p>
            <p className="text-blue-200 mb-6">Duration: {formatDuration(duration)}</p>
            <button onClick={() => { setCallState('idle'); setDuration(0); }} className="bg-blue-500 text-white px-6 py-2 rounded-full">
              Start New Call
            </button>
          </div>
        )}

        {callState === 'error' && (
          <div className="bg-red-500/20 rounded-xl p-8 text-center">
            <p className="text-white mb-4">Connection failed</p>
            <button onClick={() => setCallState('idle')} className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}