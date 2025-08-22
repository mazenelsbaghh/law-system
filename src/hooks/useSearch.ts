import { useState, useMemo } from 'react';

export interface SearchConfig {
  searchFields: string[];
  filterFields?: Record<string, any[]>;
}

export function useSearch<T>(
  data: T[],
  config: SearchConfig
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredData = useMemo(() => {
    let result = data;

    // تطبيق البحث النصي
    if (searchTerm.trim()) {
      result = result.filter((item: any) =>
        config.searchFields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // تطبيق الفلاتر
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        result = result.filter((item: any) => {
          const itemValue = field.split('.').reduce((obj, key) => obj?.[key], item);
          return Array.isArray(value) 
            ? value.includes(itemValue)
            : itemValue === value;
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, config.searchFields]);

  const updateFilter = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  const hasActiveFilters = searchTerm.trim() !== '' || Object.values(filters).some(v => v !== undefined && v !== '' && v !== 'all');

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData,
    hasActiveFilters,
    resultCount: filteredData.length,
    totalCount: data.length
  };
}