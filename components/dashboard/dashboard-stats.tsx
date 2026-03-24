'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, DollarSign, Target } from 'lucide-react';

interface DashboardStatsProps {
  totalSpent: number;
  totalBudget: number;
  remaining: number;
  expenseCount: number;
}

export function DashboardStats({
  totalSpent,
  totalBudget,
  remaining,
  expenseCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-chart-1 to-chart-1/60',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: 'Total Budget',
      value: `$${totalBudget.toFixed(2)}`,
      icon: Wallet,
      color: 'from-chart-2 to-chart-2/60',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'Remaining',
      value: `$${Math.max(0, remaining).toFixed(2)}`,
      icon: DollarSign,
      color: 'from-primary to-primary/60',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Transactions',
      value: expenseCount.toString(),
      icon: Target,
      color: 'from-chart-4 to-chart-4/60',
      bgColor: 'bg-chart-4/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
