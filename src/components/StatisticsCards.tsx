import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatisticItem {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  progress?: number;
  maxValue?: number;
}

interface StatisticsCardsProps {
  statistics: StatisticItem[];
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20', 
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20'
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
};

const trendColors = {
  up: 'text-success',
  down: 'text-destructive',
  neutral: 'text-muted-foreground'
};

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  statistics,
  className = "",
  columns = 4
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {statistics.map((stat) => {
        const IconComponent = stat.icon;
        const TrendIcon = stat.trend ? trendIcons[stat.trend] : null;
        
        return (
          <Card key={stat.id} className="hover:shadow-md transition-all duration-200 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground font-arabic">
                {stat.title}
              </CardTitle>
              {IconComponent && (
                <div className={`p-2 rounded-lg ${stat.color ? colorClasses[stat.color] : 'bg-muted'}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-2xl font-bold font-arabic">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
                </div>
                
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground font-arabic">
                    {stat.subtitle}
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              {stat.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>التقدم</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <Progress 
                    value={stat.progress} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Trend */}
              {stat.trend && stat.trendValue && TrendIcon && (
                <div className="flex items-center gap-1">
                  <TrendIcon className={`h-3 w-3 ${trendColors[stat.trend]}`} />
                  <span className={`text-xs font-medium ${trendColors[stat.trend]}`}>
                    {stat.trendValue}
                  </span>
                  <span className="text-xs text-muted-foreground">من الشهر السابق</span>
                </div>
              )}

              {/* Usage Progress */}
              {stat.maxValue && typeof stat.value === 'number' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>الاستخدام</span>
                    <span>{stat.value} / {stat.maxValue}</span>
                  </div>
                  <Progress 
                    value={(stat.value / stat.maxValue) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};