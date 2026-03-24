'use client';

import { useState, useMemo } from 'react';
import { useBudgets } from '@/lib/hooks/useBudgets';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddBudgetDialog } from '@/components/budgets/add-budget-dialog';
import { BudgetCard } from '@/components/budgets/budget-card';
import { Plus, Loader2 } from 'lucide-react';

export default function BudgetsPage() {
  const { budgets, loading: budgetsLoading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { expenses } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (expense.date >= monthStart) {
        spending[expense.category] = (spending[expense.category] || 0) + expense.amount;
      }
    });
    return spending;
  }, [expenses, monthStart]);

  if (budgetsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading budgets...</p>
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = Object.values(monthlySpending).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Set spending limits and track your finances
          </p>
        </div>
        <AddBudgetDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addBudget}
          existingCategories={budgets.map((b) => b.category)}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          }
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ${totalBudget.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Spent This Month</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-1/60 bg-clip-text text-transparent">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                totalBudget - totalSpent >= 0
                  ? 'from-chart-1 to-chart-1/60'
                  : 'from-destructive to-destructive/60'
              }`}>
                ${Math.abs(totalBudget - totalSpent).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-16 pb-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first budget to start tracking spending limits
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={monthlySpending[budget.category] || 0}
              onUpdate={updateBudget}
              onDelete={deleteBudget}
            />
          ))}
        </div>
      )}
    </div>
  );
}
