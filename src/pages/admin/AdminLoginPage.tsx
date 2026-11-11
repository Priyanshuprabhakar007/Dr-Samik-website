/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth, OWNER_EMAIL } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { user, isAdmin, isOwner, loading, authError, loginWithGoogle, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/admin';

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, loading, navigate, from]);

  const handleGoogleSignIn = async () => {
    clearAuthError();
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F6F0E9] flex flex-col justify-between font-sans selection:bg-[#C9A47F]/30 selection:text-[#F6F0E9] relative overflow-hidden">
      {/* Background Architectural Subtle Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A47F]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#24211E]/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 sm:p-8 flex items-center justify-between z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-[#AFA89F] hover:text-[#C9A47F] uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-[#AFA89F]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Shalby Hospital Clinical Gateway</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md bg-[#181514] border border-[#C9A47F]/40 p-8 sm:p-10 shadow-2xl relative">
          {/* Decorative Corner Lines */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#C9A47F]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#C9A47F]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#C9A47F]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#C9A47F]" />

          {/* Monogram */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full border border-[#C9A47F] flex items-center justify-center text-lg font-serif text-[#C9A47F] mb-4 bg-[#24211E]">
              SS
            </div>
            <span className="text-[10px] font-sans tracking-[0.28em] text-[#C9A47F] uppercase font-semibold block">
              PRACTICE ADMINISTRATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#F6F0E9] font-light mt-1">
              Dr. Samik Sharma
            </h1>
            <p className="text-xs text-[#AFA89F] mt-1.5">
              Plastic, Cosmetic &amp; Reconstructive Surgery CMS
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* User already signed in with non-admin Google Account */}
          {user && !isAdmin && (
            <div className="mb-6 p-4 bg-[#24211E] border border-amber-500/40 text-xs text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
                <Lock className="w-3.5 h-3.5" />
                <span>Account Awaiting Verification</span>
              </div>
              <p>
                Logged in as <strong className="text-white">{user.email}</strong>, which is not an authorized administrator.
              </p>
              <p className="text-[11px] text-[#AFA89F]">
                Authorized practice owner: <strong className="text-[#C9A47F]">{OWNER_EMAIL}</strong>.
              </p>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C9A47F] text-[#0B0B0B] font-medium text-xs uppercase tracking-[0.16em] hover:bg-[#DFCAAF] transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#0B0B0B"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#0B0B0B"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#0B0B0B"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#0B0B0B"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign In with Google'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Owner email convenience reminder */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#AFA89F] font-light">
                Registered Practice Owner: <span className="text-[#C9A47F] font-mono">{OWNER_EMAIL}</span>
              </span>
            </div>
          </div>

          {/* Security & Confidentiality Notice */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#C9A47F]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-medium uppercase tracking-wider text-[10px]">Restricted Clinical Area</span>
            </div>
            <p className="text-[11px] text-[#AFA89F] leading-relaxed">
              This administrative portal is exclusively for authorized surgical staff and clinical management of Dr. Samik Sharma&apos;s department at Shalby Hospital, Mohali.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[10px] text-[#7C766F] uppercase tracking-[0.2em] z-10">
        Shalby Multi-Specialty Hospital, Mohali · All Rights Reserved
      </footer>
    </div>
  );
};
