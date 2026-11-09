import React, { createContext, useContext, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export type Role = 'customer' | 'owner' | 'admin';
export type User = { uid: string; name: string; email: string; role: Role };

type AuthValue = {
  user: User | null;
  signUp: (name: string, email: string, password: string, role: Role) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

function friendlyError(e: any): Error {
  const code: string = e?.code ?? '';
  if (code.includes('email-already-in-use')) return new Error('This email is already registered. Try signing in.');
  if (code.includes('invalid-email')) return new Error('That email address is not valid.');
  if (code.includes('weak-password')) return new Error('Password must be at least 6 characters.');
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return new Error('Wrong email or password.');
  if (code.includes('network')) return new Error('No internet connection. Check your network and try again.');
  if (code.includes('operation-not-allowed')) return new Error('Email/Password sign-in is not enabled in Firebase.');
  if (code.includes('permission-denied')) return new Error('Database permission denied. Publish the Firestore rules.');
  return new Error(e?.message ?? 'Something went wrong. Please try again.');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signUp = async (name: string, email: string, password: string, role: Role) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await setDoc(doc(db, 'washrideUsers', cred.user.uid), { name, email: cleanEmail, role });
      setUser({ uid: cred.user.uid, name, email: cleanEmail, role });
    } catch (e) {
      throw friendlyError(e);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const snap = await getDoc(doc(db, 'washrideUsers', cred.user.uid));
      const data = snap.data() as { name?: string; role?: Role } | undefined;
      setUser({
        uid: cred.user.uid,
        name: data?.name ?? cleanEmail.split('@')[0],
        email: cleanEmail,
        role: data?.role ?? 'customer',
      });
    } catch (e) {
      throw friendlyError(e);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);