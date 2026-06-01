import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tripService from '../services/tripService.js';

export function useTrips(params) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => tripService.fetchTrips(params),
  });
}

export function useTrip(id) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.fetchTrip(id),
    enabled: Boolean(id),
  });
}

export function useTripMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }) => tripService.updateTrip(id, data),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trip', v.id] });
    },
  });
  const remove = useMutation({
    mutationFn: tripService.deleteTrip,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
  return { create, update, remove };
}
