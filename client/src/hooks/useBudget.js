import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as budgetService from '../services/budgetService.js';

export function useBudget(tripId) {
  return useQuery({
    queryKey: ['budget', tripId],
    queryFn: () => budgetService.fetchBudget(tripId),
    enabled: Boolean(tripId),
  });
}

export function useSaveBudget(tripId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => budgetService.saveBudget(tripId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget', tripId] }),
  });
}
