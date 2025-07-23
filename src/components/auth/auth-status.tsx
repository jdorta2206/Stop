"use client";

import { useAuth } from '@/contexts/auth-context';
import { LogIn, LogOut, Loader2, ShieldAlert, Facebook } from 'lucide-react';
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Componente para el ícono de Google (mantenemos tu versión que es mejor)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" className="mr-2">
    <path fill="#4285F4" d="M21.35 11.1h-9.2v2.7h5.3c-.2 1.1-.9 2-2.1 2.7v1.9c2.1-1 3.8-3.1 3.8-5.7 0-.6-.1-1.1-.2-1.6z" />
    <path fill="#34A853" d="M12.15 21.5c2.5 0 4.6-.8 6.1-2.2l-1.9-1.5c-.8.5-1.9.9-3.2.9-2.5 0-4.6-1.7-5.3-4H2.9v1.9C4.6 19.5 7.9 21.5 12.15 21.5z" />
    <path fill="#FBBC05" d="M7.85 14.3c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V9H2.9c-.7 1.4-1.2 3-1.2 4.7s.5 3.3 1.2 4.7l4.9-1.9z" />
    <path fill="#EA4335" d="M12.15 6.5c1.4 0 2.6.5 3.5 1.4l1.8-1.8C15.9 4.6 14.1 3.5 12.15 3.5c-4.2 0-7.5 2.9-9.2 6.6l4.9 1.9c.7-2.2 2.9-3.9 5.3-3.9z" />
  </svg>
);

// Añadimos ícono para Apple
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" className="mr-2">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000" />
  </svg>
);

export function AuthStatus() {
  const auth = useAuth();
  const supabase = useSupabaseClient();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!auth) {
    return (
      <button
        disabled
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </button>
    );
  }

  const { user, loading, signOut } = auth;

  const userName = user?.user_metadata?.name || user?.email || 'Usuario'; const userAvatar = user?.user_metadata?.avatar_url;
  const userEmail = user?.email || "Sin email";

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    setAuthError(null);
    setIsLoginMenuOpen(false);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setAuthError(`Error al iniciar con ${provider}: ${error.message}`);
      console.error(error);
    }
  };

  const handleEmailSignIn = () => {
    window.location.href = '/auth/signup';
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  if (loading) {
    return (
      <button
        disabled
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </button>
    );
  }

  return (
    <div className="flex items-center">
      {user ? (
        <div className="relative">
          {/* ... (mantenemos tu código existente para el menú de usuario) ... */}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Acceder
          </button>

          {isLoginMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50">
              <div className="px-2 py-1.5 text-sm">Iniciar sesión con</div>
              <div className="h-px bg-border my-1"></div>

              <button
                onClick={() => handleOAuthSignIn('google')}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
              >
                <GoogleIcon />
                Google
              </button>

              <button
                onClick={() => handleOAuthSignIn('facebook')}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </button>

              <button
                onClick={() => handleOAuthSignIn('apple')}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
              >
                <AppleIcon />
                Apple
              </button>

              <div className="h-px bg-border my-1"></div>

              <button
                onClick={handleEmailSignIn}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Correo electrónico
              </button>

              {authError && (
                <div className="px-2 py-1.5 text-xs text-red-500 flex items-center">
                  <ShieldAlert className="mr-2 h-3 w-3" />
                  {authError}
                </div>
              )}
            </div>
          )}

          {isLoginMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsLoginMenuOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}