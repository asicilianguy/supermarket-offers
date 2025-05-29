"use client"

```tsx file="client/src/components/offers/OfferFilters.tsx"
[v0-no-op-code-block-prefix]import React from 'react';

interface OfferFiltersProps {
  filters: {
    supermarketAisle: string;
  };
  onFilterChange: (filterName: string, filterValue: string) => void;
  aisles: string[]; // Assuming aisles is an array of strings
}

const OfferFilters: React.FC<OfferFiltersProps> = ({ filters, onFilterChange, aisles }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="supermarketAisle" className="block text-sm font-medium text-gray-700">
          Reparto
        </label>
        <select
          id="supermarketAisle"
          value={filters.supermarketAisle}
          onChange={(e) => onFilterChange("supermarketAisle", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tutti i reparti</option>
          {aisles.map((aisle) => (
            <option key={aisle} value={aisle}>
              {aisle}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OfferFilters;
