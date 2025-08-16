import React, { useState, useMemo } from 'react';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onDateRangeChange }) => {
  const [startDateInput, setStartDateInput] = useState<string>('');
  const [endDateInput, setEndDateInput] = useState<string>('');

  const effectiveStartDate = useMemo(() => {
    return (startDateInput && endDateInput && new Date(startDateInput) <= new Date(endDateInput))
      ? startDateInput
      : undefined;
  }, [startDateInput, endDateInput]);

  const effectiveEndDate = useMemo(() => {
    return (startDateInput && endDateInput && new Date(startDateInput) <= new Date(endDateInput))
      ? endDateInput
      : undefined;
  }, [startDateInput, endDateInput]);

  // Call onDateRangeChange whenever effective dates change
  React.useEffect(() => {
    onDateRangeChange(effectiveStartDate, effectiveEndDate);
  }, [effectiveStartDate, effectiveEndDate, onDateRangeChange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDateInput(newStartDate);
    if (endDateInput && new Date(newStartDate) > new Date(endDateInput)) {
      setEndDateInput('');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    if (startDateInput && new Date(newEndDate) < new Date(startDateInput)) {
      alert('End Date cannot be before Start Date.');
      setEndDateInput('');
    } else {
      setEndDateInput(newEndDate);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="font-medium text-gray-700">Filter by Date Range:</span>
      <label htmlFor="startDate" className="sr-only">Start Date:</label>
      <input
        type="date"
        id="startDate"
        value={startDateInput}
        onChange={handleStartDateChange}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        aria-label="Start Date"
      />

      <label htmlFor="endDate" className="sr-only">End Date:</label>
      <input
        type="date"
        id="endDate"
        value={endDateInput}
        onChange={handleEndDateChange}
        disabled={!startDateInput}
        min={startDateInput}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        aria-label="End Date"
      />
    </div>
  );
};

export default React.memo(DateRangeFilter);
