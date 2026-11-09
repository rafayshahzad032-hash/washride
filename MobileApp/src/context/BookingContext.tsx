import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export type Booking = {
  id: string;
  transactionId: string;
  washId: string;
  washName: string;
  washAddress: string;
  customerName: string;
  customerEmail: string;
  serviceNames: string[];
  amount: number;
  discountAmount?: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pay at wash';
  date: string;
  time: string;
  createdAt: string;
  createdMs: number;
};

type NewBooking = Omit<Booking, 'id' | 'transactionId' | 'createdAt' | 'createdMs'>;

type BookingValue = {
  bookings: Booking[];
  addBooking: (b: NewBooking) => Booking;
  isSlotTaken: (washId: string, date: string, time: string) => boolean;
};

const BookingContext = createContext<BookingValue>({
  bookings: [],
  addBooking: () => {
    throw new Error('BookingProvider missing');
  },
  isSlotTaken: () => false,
});

const randomCode = (len: number) =>
  Math.random().toString(36).substring(2, 2 + len).toUpperCase();

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'bookings'),
      snap => {
        const list = snap.docs.map(d => d.data() as Booking);
        list.sort((a, b) => (b.createdMs ?? 0) - (a.createdMs ?? 0));
        setBookings(list);
      },
      err => console.warn('bookings listener error', err),
    );
    return unsub;
  }, []);

  const addBooking = (b: NewBooking): Booking => {
    const booking: Booking = {
      ...b,
      id: 'WR-' + randomCode(6),
      transactionId: 'TXN-' + randomCode(8),
      createdAt: new Date().toLocaleString(),
      createdMs: Date.now(),
    };
    setDoc(doc(db, 'bookings', booking.id), booking).catch(e => console.warn('booking failed', e));
    return booking;
  };

  const isSlotTaken = (washId: string, date: string, time: string) =>
    bookings.some(b => b.washId === washId && b.date === date && b.time === time);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, isSlotTaken }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);