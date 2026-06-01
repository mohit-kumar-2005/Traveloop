import { createContext, useContext, useMemo, useState } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [builderTripId, setBuilderTripId] = useState(null);
  const [activityStopContext, setActivityStopContext] = useState(null);

  const value = useMemo(
    () => ({
      builderTripId,
      setBuilderTripId,
      activityStopContext,
      setActivityStopContext,
    }),
    [builderTripId, activityStopContext]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used within TripProvider');
  return ctx;
}
