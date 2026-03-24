'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Expense } from '@/lib/hooks/useExpenses';

interface SpendingTrendsProps {
  expenses: Expense[];
}

export function SpendingTrends({ expenses }: SpendingTrendsProps) {
  const trendData = useMemo(() => {
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyData: Record<string, number> = {};

    expenses
      .filter((e) => e.date >= thirtyDaysAgo)
      .forEach((expense) => {
        const dateStr = new Date(expense.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        dailyData[dateStr] = (dailyData[dateStr] || 0) + expense.amount;
      });

    // Calculate cumulative sum
    let cumulative = 0;
    return Object.entries(dailyData)
      .sort((a, b) => {
        const dateA = new Date(`${a[0]}`);
        const dateB = new Date(`${b[0]}`);
        return dateA.getTime() - dateB.getTime();
      })
      .map(([date, amount]) => {
        cumulative += amount;
        return {
          date,
          spent: parseFloat(amount.toFixed(2)),
          cumulative: parseFloat(cumulative.toFixed(2)),
        };
      });
  }, [expenses]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {trendData.length === 0 ? (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-foreground)',
                }}
                formatter={(value) => `$${(value as number).toFixed(2)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={false}
                name="Daily Spending"
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={false}
                name="Cumulative"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
