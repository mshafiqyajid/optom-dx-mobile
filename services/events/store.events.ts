import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EventsAPI from './api.events';
import {
  CreateEventRequest,
  UpdateEventRequest,
  EventsQueryParams,
} from './type.events';

const key = 'Events';

export const useGetEvents = (params?: EventsQueryParams) => {
  return useQuery({
    queryKey: [key, 'list', params],
    queryFn: () => EventsAPI.getEvents(params),
  });
};

export const useGetEventById = (id: number) => {
  return useQuery({
    queryKey: [key, 'detail', id],
    queryFn: () => EventsAPI.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventRequest) => EventsAPI.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key, 'list'] });
    },
    onError: (error) => {
      console.error('Create event error:', error);
    }
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventRequest }) =>
      EventsAPI.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [key, 'list'] });
      queryClient.invalidateQueries({ queryKey: [key, 'detail', variables.id] });
    },
    onError: (error) => {
      console.error('Update event error:', error);
    }
  });
};

export const useCheckInEvent = () => {
  return useMutation({
    mutationFn: (eventId: number) => EventsAPI.checkInEvent(eventId),
    onError: (error) => {
      console.error('Event check-in error:', error);
    }
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => EventsAPI.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key, 'list'] });
    },
    onError: (error) => {
      console.error('Delete event error:', error);
    }
  });
};
