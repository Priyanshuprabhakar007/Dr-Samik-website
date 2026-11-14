/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAccess: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const OWNER_EMAIL = 'dilseinvite@gmail.com';

type Privileges = { isAdmin: boolean; isOwner: boolean; error: string | null };

/**
 * Resolve administrative access against Firebase Authentication + Firestore.
 * Deliberately independent of Vercel serverless functions: a broken booking API
 * must not prevent the practice owner from signing into the CMS.
 *
 * For staff, /admins/{auth.uid} must exist with a valid role. The database
 * record, not an email-derived key or a stale token claim, is authoritative.
 */
async function resolveAccess(currentUser: User): Promise<Privileges> {
  if (!currentUser.emailVerified) {
    return { isAdmin: false, isOwner: false, error: 'Please verify your Google account email before accessing the practice portal.' };
  }
  const email = (currentUser.email || '').trim().toLowerCase();
  if (email === OWNER_EMAIL) {
    return { isAdmin: true, isOwner: true, error: null };
  }
  try {
    const snapshot = await getDoc(doc(db, 'admins', currentUser.uid));
    const role = snapshot.exists() ? snapshot.data()?.role : undefined;
    return { isAdmin: role === 'admin', isOwner: false, error: null };
  } catch (err) {
    console.warn('Unable to verify admin permissions in Firestore:', err);
    return {
      isAdmin: false,
      isOwner: false,
      error: 'Unable to verify staff access. Check the Firebase database connection and retry. No access has been granted.',
    };
  }
}

function signInMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code === 'auth/unauthorized-domain') {
    return 'This website domain is not authorized in Firebase Authentication. Add the Vercel production domain in Firebase Authentication → Authorized domains.';
  }
  if (code === 'auth/popup-blocked') return 'Your browser blocked the Google sign-in popup. Allow popups for this website and try again.';
  if (code === 'auth/popup-closed-by-user') return 'Sign-in was cancelled. Select your practice Google account to continue.';
  if (code === 'auth/network-request-failed') return 'Unable to reach Firebase Authentication. Check your network and retry.';
  return 'Google sign-in did not complete. Please retry or check the Firebase Authentication setup.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const applyPrivileges = async (currentUser: User) => {
    // Fail closed while checking a new account.
    setIsAdmin(false);
    setIsOwner(false);
    const next = await resolveAccess(currentUser);
    setIsAdmin(next.isAdmin);
    setIsOwner(next.isOwner);
    setAuthError(next.error);
  };

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        await applyPrivileges(currentUser);
      } else {
        setIsAdmin(false);
        setIsOwner(false);
        setAuthError(null);
      }
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await applyPrivileges(result.user);
    } catch (err) {
      setAuthError(signInMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const refreshAccess = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setAuthError('Sign in with an authorized Google account first.');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await currentUser.getIdToken(true);
      await applyPrivileges(currentUser);
    } catch (err) {
      console.warn('Unable to refresh admin login:', err);
      setIsAdmin(false);
      setIsOwner(false);
      setAuthError('Could not refresh your login. Check the connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setIsOwner(false);
      setAuthError(null);
    } catch (err) {
      console.warn('Unable to sign out:', err);
      setAuthError('Sign-out was unsuccessful. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isAdmin, isOwner, loading, authError,
      loginWithGoogle, logout, refreshAccess,
      clearAuthError: () => setAuthError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
