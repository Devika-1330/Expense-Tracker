'use client';

import { useMemo } from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { SpendingTrends } from '@/components/analytics/spending-trends';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { expenses, loading } = useExpenses();

  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalSpent: 0,
        avgTransaction: 0,
        highestCategory: '',
        highestAmount: 0,
      };
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgTransaction = totalSpent / expenses.length;

    const categories: Record<string, number> = {};
    expenses.forEach((e) => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const [highestCategory, highestAmount] = Object.entries(categories).sort(
      (a, b) => b[1] - a[1]
    )[0] || ['', 0];

    return {
      totalSpent,
      avgTransaction,
      highestCategory,
      highestAmount: highestAmount as number,
    };
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights into your spending patterns
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-1/60 bg-clip-text text-transparent">
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Avg Transaction
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ${stats.avgTransaction.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Transactions
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-chart-2 to-chart-2/60 bg-clip-text text-transparent">
                {expenses.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Top Category
              </p>
              <p className="text-sm font-bold text-chart-3 capitalize">
                {stats.highestCategory.replace('_', ' ')}
              </p>
              <p className="text-xs text-muted-foreground">
                ${stats.highestAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts expenses={expenses} />
        <SpendingTrends expenses={expenses} />
      </div>
    </div>
  );
}
