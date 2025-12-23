import api from '../api';
import {
  EventsListResponse,
  EventDetailResponse,
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
  EventsQueryParams,
  EventCheckInResponse,
  DeleteEventResponse,
} from './type.events';

// Helper function to remove empty fields from an object
const removeEmptyFieldsInObject = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  ) as Partial<T>;
};

const eventsAPIs = {
  async getEvents(params?: EventsQueryParams): Promise<EventsListResponse> {
    const finalParams = removeEmptyFieldsInObject(params || {});
    return api.get(`/events`, { params: finalParams }).then((response) => response.data);
  },

  async getEventById(id: number): Promise<EventDetailResponse> {
    return api.get(`/events/${id}`).then((response) => response.data);
  },

  async createEvent(data: CreateEventRequest): Promise<CreateEventResponse> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'staff_operators' || key === 'staff_optometrists') {
          // Handle arrays - append each item with array notation
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, String(item));
            });
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return api.post(`/events`, formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then((response) => response.data);
  },

  async updateEvent(id: number, data: UpdateEventRequest): Promise<UpdateEventResponse> {
    const formData = new FormData();
    const finalData = removeEmptyFieldsInObject(data);

    Object.entries(finalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'staff_operators' || key === 'staff_optometrists') {
          // Handle arrays - append each item with array notation
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, String(item));
            });
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.append('_method', 'PUT');

    return api.post(`/events/${id}`, formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then((response) => response.data);
  },

  async checkInEvent(eventId: number): Promise<EventCheckInResponse> {
    return api.get(`/events/${eventId}/check-in`).then((response) => response.data);
  },

  async deleteEvent(id: number): Promise<DeleteEventResponse> {
    return api.delete(`/events/${id}`).then((response) => response.data);
  },
};

export default eventsAPIs;
