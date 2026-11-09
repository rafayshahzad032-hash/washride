import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { CarWash, Service } from '../services/api';

export type Discount = {
  id: string;
  title: string;
  percent: number;
  serviceIds: string[];
  startDate: string;
  endDate: string;
  active: boolean;
};

export type BusinessStatus = 'pending' | 'approved' | 'rejected';

export type Business = CarWash & {
  ownerEmail: string;
  ownerName: string;
  phone: string;
  description: string;
  discounts: Discount[];
  suspended?: boolean;
  status?: BusinessStatus;
};

type NewBusiness = Omit<Business, 'id' | 'rating' | 'discounts' | 'suspended' | 'status'>;
type NewDiscount = Omit<Discount, 'id' | 'active'>;

// A business with no status (registered before approvals existed) counts as approved
export const statusOf = (b: Business): BusinessStatus => b.status ?? 'approved';
export const isListed = (b: Business) => statusOf(b) === 'approved' && !b.suspended;

type BusinessValue = {
  businesses: Business[];
  listedBusinesses: Business[];
  registerBusiness: (b: NewBusiness) => Promise<void>;
  addService: (businessId: string, name: string, price: number) => void;
  removeService: (businessId: string, serviceId: string) => void;
  addDiscount: (businessId: string, d: NewDiscount) => void;
  toggleDiscount: (businessId: string, discountId: string) => void;
  updateDiscount: (businessId: string, discountId: string, d: NewDiscount) => void;
  deleteDiscount: (businessId: string, discountId: string) => void;
  setSuspended: (businessId: string, suspended: boolean) => void;
  setStatus: (businessId: string, status: BusinessStatus) => void;
  deleteBusiness: (businessId: string) => void;
};

const BusinessContext = createContext<BusinessValue>({
  businesses: [],
  listedBusinesses: [],
  registerBusiness: async () => {},
  addService: () => {},
  removeService: () => {},
  addDiscount: () => {},
  toggleDiscount: () => {},
  updateDiscount: () => {},
  deleteDiscount: () => {},
  setSuspended: () => {},
  setStatus: () => {},
  deleteBusiness: () => {},
});

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 8)}`;

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'businesses'),
      snap => setBusinesses(snap.docs.map(d => ({ ...(d.data() as Business), id: d.id }))),
      err => console.warn('businesses listener error', err),
    );
    return unsub;
  }, []);

  const listedBusinesses = useMemo(() => businesses.filter(isListed), [businesses]);

  const save = (b: Business) =>
    setDoc(doc(db, 'businesses', b.id), b).catch(e => console.warn('save failed', e));

  const update = (id: string, fn: (b: Business) => Business) => {
    const current = businesses.find(b => b.id === id);
    if (current) save(fn(current));
  };

  const registerBusiness = async (b: NewBusiness) => {
    const ownerId = auth.currentUser?.uid;
    if (!ownerId) throw new Error('Not signed in');
    const business: Business = {
      ...b,
      id: ownerId,
      rating: 0,
      discounts: [],
      suspended: false,
      status: 'pending',
    };
    await setDoc(doc(db, 'businesses', ownerId), business);
  };

  const addService = (businessId: string, name: string, price: number) =>
    update(businessId, b => ({
      ...b,
      services: [...b.services, { id: uid('svc'), name, price } as Service],
    }));

  const removeService = (businessId: string, serviceId: string) =>
    update(businessId, b => ({ ...b, services: b.services.filter(s => s.id !== serviceId) }));

  const addDiscount = (businessId: string, d: NewDiscount) =>
    update(businessId, b => ({
      ...b,
      discounts: [...b.discounts, { ...d, id: uid('disc'), active: true }],
    }));

  const toggleDiscount = (businessId: string, discountId: string) =>
    update(businessId, b => ({
      ...b,
      discounts: b.discounts.map(d => (d.id === discountId ? { ...d, active: !d.active } : d)),
    }));

  const updateDiscount = (businessId: string, discountId: string, d: NewDiscount) =>
    update(businessId, b => ({
      ...b,
      discounts: b.discounts.map(x => (x.id === discountId ? { ...x, ...d } : x)),
    }));

  const deleteDiscount = (businessId: string, discountId: string) =>
    update(businessId, b => ({
      ...b,
      discounts: b.discounts.filter(x => x.id !== discountId),
    }));

  const setSuspended = (businessId: string, suspended: boolean) =>
    update(businessId, b => ({ ...b, suspended }));

  const setStatus = (businessId: string, status: BusinessStatus) =>
    update(businessId, b => ({ ...b, status }));

  const deleteBusiness = (businessId: string) => {
    deleteDoc(doc(db, 'businesses', businessId)).catch(e => console.warn('delete failed', e));
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        listedBusinesses,
        registerBusiness,
        addService,
        removeService,
        addDiscount,
        toggleDiscount,
        updateDiscount,
        deleteDiscount,
        setSuspended,
        setStatus,
        deleteBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusinesses = () => useContext(BusinessContext);