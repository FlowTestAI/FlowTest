import { create } from 'zustand';

export const useEventStore = create((set, get) => ({
  events: [],
  addEvent: (event) => {
    set((state) => ({ events: [...state.events, event] }));
  },
  removeEvent: (eventId) => {
    set((state) => ({ events: state.events.filter((e) => e.id != eventId) }));
  },
}));

export const _addEvent = useEventStore((state) => state.addEvent);
export const _removeEvent = useEventStore((state) => state.removeEvent);
