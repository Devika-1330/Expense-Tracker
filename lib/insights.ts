import type { Expense } from './hooks/useExpenses';
import type { Budget } from './hooks/useBudgets';

export interface Insight {
  type: 'warning' | 'opportunity' | 'info' | 'success';
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
}

export function generateInsights(
  expenses: Expense[],
  budgets: Budget[]
): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Calculate current month spending by category
  const monthlySpending: Record<string, number> = {};
  const allTimeSpending: Record<string, number> = {};

  expenses.forEach((expense) => {
    // All time spending
    allTimeSpending[expense.category] =
      (allTimeSpending[expense.category] || 0) + expense.amount;

    // Last 30 days
    if (expense.date >= thirtyDaysAgo) {
      monthlySpending[expense.category] =
        (monthlySpending[expense.category] || 0) + expense.amount;
    }
  });

  // Budget alerts
  budgets.forEach((budget) => {
    const categorySpending = monthlySpending[budget.category] || 0;
    const percentage = (categorySpending / budget.limit) * 100;

    if (percentage >= 100) {
      insights.push({
        type: 'warning',
        title: `Over budget: ${budget.category}`,
        description: `You've spent $${categorySpending.toFixed(2)} of your $${budget.limit.toFixed(2)} budget for ${budget.category}. You're ${(percentage - 100).toFixed(0)}% over.`,
        impact: 'high',
      });
    } else if (percentage >= 80) {
      insights.push({
        type: 'warning',
        title: `Approaching budget limit: ${budget.category}`,
        description: `You've spent ${percentage.toFixed(0)}% of your $${budget.limit.toFixed(2)} budget for ${budget.category}. Watch your spending!`,
        impact: 'medium',
      });
    }
  });

  // Spending pattern analysis (last 90 days)
  const last30Days = expenses.filter(
    (e) => e.date >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  );
  const last60Days = expenses.filter(
    (e) => e.date >= new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  );

  const avg30 =
    last30Days.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, last30Days.length);
  const avg60 =
    last60Days.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, last60Days.length);

  if (avg30 > avg60 * 1.25) {
    insights.push({
      type: 'warning',
      title: 'Spending increase detected',
      description: `Your average spending per transaction is ${((avg30 / avg60 - 1) * 100).toFixed(0)}% higher than the last 60-day average. Consider reducing expenses.`,
      impact: 'medium',
    });
  }

  // Find top spending category
  const topCategory = Object.entries(monthlySpending).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (topCategory && monthlySpending[topCategory[0]] > 0) {
    const topSpent = topCategory[1];
    const totalSpent = Object.values(monthlySpending).reduce((a, b) => a + b, 0);
    const percentage = (topSpent / totalSpent) * 100;

    if (percentage > 50) {
      insights.push({
        type: 'info',
        title: `High concentration in ${topCategory[0]}`,
        description: `${percentage.toFixed(0)}% of your spending is in ${topCategory[0]}. Consider diversifying.`,
        impact: 'low',
      });
    }
  }

  // Find savings opportunities
  const categories = Object.keys(monthlySpending);
  if (categories.length > 2) {
    const avgCategorySpend =
      Object.values(monthlySpending).reduce((a, b) => a + b, 0) / categories.length;
    const lowSpendingCategories = categories.filter(
      (cat) => monthlySpending[cat] < avgCategorySpend * 0.3
    );

    if (lowSpendingCategories.length > 0 && monthlySpending[topCategory[0]] > 200) {
      insights.push({
        type: 'opportunity',
        title: 'Rebalance spending',
        description: `You're spending significantly more on ${topCategory[0]} than on other categories. Look for ways to reduce this category.`,
        impact: 'medium',
      });
    }
  }

  // Low spending achievement
  if (
    Object.keys(monthlySpending).length === 0 ||
    Object.values(monthlySpending).reduce((a, b) => a + b, 0) === 0
  ) {
    insights.push({
      type: 'success',
      title: 'No expenses recorded',
      description: 'Start tracking your expenses to get personalized insights.',
      impact: 'low',
    });
  } else {
    const totalMonthly = Object.values(monthlySpending).reduce(
      (a, b) => a + b,
      0
    );
    if (totalMonthly < 500) {
      insights.push({
        type: 'success',
        title: 'Great spending control',
        description: 'Your monthly spending is well below average. Keep up the good financial habits!',
        impact: 'low',
      });
    }
  }

  // Recurring expense reminder
  const recurringExpenses = expenses.filter((e) => e.recurring);
  if (recurringExpenses.length > 0) {
    const totalRecurring = recurringExpenses.reduce((sum, e) => sum + e.amount, 0);
    insights.push({
      type: 'info',
      title: `${recurringExpenses.length} recurring expenses`,
      description: `You have ${recurringExpenses.length} recurring expense(s) totaling $${totalRecurring.toFixed(2)}. Review them regularly.`,
      impact: 'low',
    });
  }

  return insights.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return (impactOrder[a.impact || 'low'] ?? 2) - (impactOrder[b.impact || 'low'] ?? 2);
  });
}

export function calculateCategoryStats(expenses: Expense[]) {
  const stats: Record<
    string,
    { amount: number; percentage: number; count: number }
  > = {};
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  expenses.forEach((expense) => {
    if (!stats[expense.category]) {
      stats[expense.category] = { amount: 0, percentage: 0, count: 0 };
    }
    stats[expense.category].amount += expense.amount;
    stats[expense.category].count += 1;
  });

  Object.keys(stats).forEach((category) => {
    stats[category].percentage =
      total > 0 ? (stats[category].amount / total) * 100 : 0;
  });

  return stats;
}
