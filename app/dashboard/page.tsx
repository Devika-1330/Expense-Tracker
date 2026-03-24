'use client';

import { useMemo } from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { useBudgets } from '@/lib/hooks/useBudgets';
import { generateInsights } from '@/lib/insights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { budgets, loading: budgetsLoading } = useBudgets();

  const insights = useMemo(() => generateInsights(expenses, budgets), [expenses, budgets]);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses.filter((e) => e.date >= firstDay);
  }, [expenses]);

  const totalSpent = useMemo(
    () => currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [currentMonthExpenses]
  );

  const totalBudget = useMemo(
    () => budgets.reduce((sum, b) => sum + b.limit, 0),
    [budgets]
  );

  const remaining = totalBudget - totalSpent;

  if (expensesLoading || budgetsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Here's your financial overview for this month
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats
        totalSpent={totalSpent}
        totalBudget={totalBudget}
        remaining={remaining}
        expenseCount={currentMonthExpenses.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart and Insights */}
        <div className="lg:col-span-2 space-y-6">
          <SpendingChart expenses={expenses} />
        </div>

        {/* Insights Sidebar */}
        <div>
          <InsightsPanel insights={insights} />
        </div>
      </div>

      {/* Recent Expenses */}
      <RecentExpenses expenses={currentMonthExpenses.slice(0, 5)} />
    </div>
  );
}
