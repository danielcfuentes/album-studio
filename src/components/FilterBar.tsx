import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
  onTagFilter: (tag: string | null) => void;
  onYearFilter: (year: string | null) => void;
  availableTags: string[];
  availableYears: string[];
  activeTag: string | null;
  activeYear: string | null;
}

export function FilterBar({
  onSearch,
  onSortChange,
  onTagFilter,
  onYearFilter,
  availableTags,
  availableYears,
  activeTag,
  activeYear,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onSearch('');
    onTagFilter(null);
    onYearFilter(null);
  };

  const hasActiveFilters = searchQuery || activeTag || activeYear;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select defaultValue="newest" onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Viewed</SelectItem>
          </SelectContent>
        </Select>

        {/* Year Filter - use sentinel value; Radix Select disallows value="" */}
        <Select 
          value={activeYear || '__all__'} 
          onValueChange={(v) => onYearFilter(v === '__all__' ? null : v)}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {availableTags.slice(0, 8).map((tag) => (
          <Badge
            key={tag}
            variant={activeTag === tag ? 'default' : 'secondary'}
            className="cursor-pointer transition-colors"
            onClick={() => onTagFilter(activeTag === tag ? null : tag)}
          >
            {tag}
          </Badge>
        ))}
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-2 h-6 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
