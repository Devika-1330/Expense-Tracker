'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Budget } from '@/lib/hooks/useBudgets';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onUpdate: (id: string, limit: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function BudgetCard({ budget, spent, onDelete }: BudgetCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const isOver = spent > budget.limit;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(budget.id);
      setDeleteOpen(false);
    } catch (error) {
      console.error('Failed to delete budget:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg capitalize">
              {budget.category.replace('_', ' ')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className={`text-xl font-semibold ${isOver ? 'text-destructive' : 'text-foreground'}`}>
                  ${spent.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Limit</p>
                <p className="text-xl font-semibold text-primary">
                  ${budget.limit.toFixed(2)}
                </p>
              </div>
            </div>
            <Progress
              value={percentage}
              className="h-2"
              style={{
                backgroundColor: 'var(--color-secondary)',
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-muted-foreground">
              {percentage.toFixed(0)}% of budget
            </span>
            {isOver && (
              <span className="text-xs font-semibold text-destructive">
                ${(spent - budget.limit).toFixed(2)} over
              </span>
            )}
            {!isOver && (
              <span className="text-xs font-semibold text-primary">
                ${(budget.limit - spent).toFixed(2)} left
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {budget.period === 'monthly' ? 'Monthly budget' : 'Yearly budget'}
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {budget.category} budget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
