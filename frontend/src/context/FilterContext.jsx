import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [yearRange, setYearRange] = useState([1987, 2026]);
  const [baseYear, setBaseYear] = useState(2026);
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [comparisonProgrammes, setComparisonProgrammes] = useState([]);

  return (
    <FilterContext.Provider value={{
      selectedProgramme,
      setSelectedProgramme,
      yearRange,
      setYearRange,
      baseYear,
      setBaseYear,
      feeType,
      setFeeType,
      comparisonProgrammes,
      setComparisonProgrammes,
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
