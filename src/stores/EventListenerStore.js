import { create } from 'zustand';

export const useEventStore = create((set) => ({
  events: [],
  addEvent: (event) => {
    set((state) => ({ events: [...state.events, event] }));
  },
  removeEvent: (eventId) => {
    set((state) => ({ events: state.events.filter((e) => e.id != eventId) }));
  },
}));
