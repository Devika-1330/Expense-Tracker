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

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: Date;
  recurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
}

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const db = getFirestoreDb();
      const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
      const loadingTimeout = setTimeout(() => setLoading(false), 1500);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(loadingTimeout);
          const expenseList: Expense[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            expenseList.push({
              id: doc.id,
              ...data,
              date: data.date?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
            } as Expense);
          });
          expenseList.sort((a, b) => b.date.getTime() - a.date.getTime());
          setExpenses(expenseList);
          setLoading(false);
        },
        () => {
          clearTimeout(loadingTimeout);
          setExpenses([]);
          setLoading(false);
        }
      );

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch {
      setExpenses([]);
      setLoading(false);
      return;
    }
  }, [user]);

  const addExpense = async (
    amount: number,
    currency: string,
    category: string,
    description: string,
    date: Date,
    recurring: boolean = false,
    recurringFrequency?: string
  ) => {
    if (!user) throw new Error('User not authenticated');
    const db = getFirestoreDb();

    const expenseData: Record<string, unknown> = {
      userId: user.uid,
      amount,
      currency,
      category,
      description,
      date: Timestamp.fromDate(date),
      recurring,
      createdAt: Timestamp.now(),
    };

    if (recurring && recurringFrequency) {
      expenseData.recurringFrequency = recurringFrequency;
    }

    await addDoc(collection(db, 'expenses'), expenseData);
  };

  const updateExpense = async (
    id: string,
    updates: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt'>>
  ) => {
    if (!user) throw new Error('User not authenticated');
    const db = getFirestoreDb();

    const docRef = doc(db, 'expenses', id);
    const updateData: Record<string, unknown> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    await updateDoc(docRef, updateData);
  };

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    const db = getFirestoreDb();
    await deleteDoc(doc(db, 'expenses', id));
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
