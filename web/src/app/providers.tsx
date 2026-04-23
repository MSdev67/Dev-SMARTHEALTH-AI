'use client';

import { AuthProvider } from '../contexts/AuthContext';
import ThemeRegistry from '../components/ThemeRegistry';
import { Toaster } from 'react-hot-toast';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeRegistry>
      <AuthProvider>
        {children}

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1f4e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </AuthProvider>
    </ThemeRegistry>
  );
}