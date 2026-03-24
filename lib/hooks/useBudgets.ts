import { useAuth } from '@/lib/auth-context';
import { getFirestoreDb } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  currency: string;
  period: 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    try {
      const db = getFirestoreDb();
      const q = query(collection(db, 'budgets'), where('userId', '==', user.uid));
      const loadingTimeout = setTimeout(() => setLoading(false), 1500);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(loadingTimeout);
          const budgetList: Budget[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            budgetList.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Budget);
          });
          setBudgets(budgetList);
          setLoading(false);
        },
        () => {
          clearTimeout(loadingTimeout);
          setBudgets([]);
          setLoading(false);
        }
      );

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch {
      setBudgets([]);
      setLoading(false);
      return;
    }
  }, [user]);

  const addBudget = async (
    category: string,
    limit: number,
    currency: string,
    period: 'monthly' | 'yearly' = 'monthly'
  ) => {
    if (!user) throw new Error('User not authenticated');
    const db = getFirestoreDb();

    await addDoc(collection(db, 'budgets'), {
      userId: user.uid,
      category,
      limit,
      currency,
      period,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  const updateBudget = async (id: string, limit: number) => {
    if (!user) throw new Error('User not authenticated');
    const db = getFirestoreDb();

    await updateDoc(doc(db, 'budgets', id), {
      limit,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteBudget = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    const db = getFirestoreDb();
    await deleteDoc(doc(db, 'budgets', id));
  };

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}
