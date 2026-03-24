'use client';

import { useState } from 'react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog';
import { ExpensesTable } from '@/components/expenses/expenses-table';
import { Plus, Loader2 } from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your expenses
          </p>
        </div>
        <AddExpenseDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addExpense}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          }
        />
      </div>

      {/* Expenses Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            Total: {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensesTable
            expenses={expenses}
            onDelete={deleteExpense}
            onUpdate={updateExpense}
          />
        </CardContent>
      </Card>
    </div>
  );
}
