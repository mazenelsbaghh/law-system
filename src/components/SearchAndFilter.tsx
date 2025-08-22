import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface FilterOption {
  label: string;
  field: string;
  options: { value: string; label: string }[];
  type?: 'select' | 'multi-select';
}

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
  onClearFilters: () => void;
  filterOptions?: FilterOption[];
  placeholder?: string;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
  className?: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  filterOptions = [],
  placeholder = "البحث...",
  hasActiveFilters,
  resultCount,
  totalCount,
  className = ""
}) => {
  return (
    <Card className={`p-4 bg-gradient-subtle border-border/50 ${className}`}>
      <div className="space-y-4">
        {/* شريط البحث */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-arabic"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* الفلاتر */}
        {filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>فلترة حسب:</span>
            </div>
            
            {filterOptions.map((option) => (
              <Select
                key={option.field}
                value={filters[option.field] || 'all'}
                onValueChange={(value) => onFilterChange(option.field, value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-auto min-w-[120px] font-arabic">
                  <SelectValue placeholder={option.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {option.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="font-arabic">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2 lg:px-3"
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                مسح الفلاتر
              </Button>
            )}
          </div>
        )}

        {/* نتائج البحث */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <Badge variant="secondary" className="font-arabic">
                {resultCount} من أصل {totalCount} نتيجة
              </Badge>
            ) : (
              <span>{totalCount} عنصر إجمالي</span>
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-1 text-xs">
              <span>فلترة نشطة</span>
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse-gentle"></div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};