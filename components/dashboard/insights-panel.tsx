'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';
import type { Insight } from '@/lib/insights';

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return AlertCircle;
      case 'opportunity':
        return Lightbulb;
      case 'success':
        return CheckCircle;
      default:
        return TrendingUp;
    }
  };

  const getColor = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'text-destructive';
      case 'opportunity':
        return 'text-chart-4';
      case 'success':
        return 'text-chart-1';
      default:
        return 'text-primary';
    }
  };

  const getBgColor = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-destructive/10 border-destructive/20';
      case 'opportunity':
        return 'bg-chart-4/10 border-chart-4/20';
      case 'success':
        return 'bg-chart-1/10 border-chart-1/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Smart Insights</CardTitle>
        <CardDescription>AI-powered recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Keep tracking expenses to unlock insights
            </p>
          ) : (
            insights.map((insight, index) => {
              const Icon = getIcon(insight.type);
              const colorClass = getColor(insight.type);
              const bgColorClass = getBgColor(insight.type);

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${bgColorClass} space-y-1`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {insight.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
