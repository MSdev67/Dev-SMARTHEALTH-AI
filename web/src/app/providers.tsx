'use client';

import { AuthProvider } from '../contexts/AuthContext';
import ThemeRegistry from '../components/ThemeRegistry';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <AuthProvider>{children}</AuthProvider>
    </ThemeRegistry>
  );
}
