import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

export type AppUser = { id: string; name: string; email: string; role: string };

export function useAllUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'washrideUsers'),
      snap =>
        setUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<AppUser, 'id'>) }))),
      err => console.warn('users listener error', err),
    );
    return unsub;
  }, []);
  return users;
}