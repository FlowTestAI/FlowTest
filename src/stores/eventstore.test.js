import { act, renderHook } from '@testing-library/react';
import { useEventStore } from './EventListenerStore';

describe('Event store', () => {
  const openNewFlowTestEvent = {
    id: '1',
    type: 'OPEN_NEW_FLOWTEST',
    collectionId: '2',
    name: 'test',
    path: '/parent/test-folder',
  };

  const openSavedFlowTestEvent = {
    id: '2',
    type: 'OPEN_SAVED_FLOWTEST',
    collectionId: '3',
    name: 'test1',
    path: '/parent/test-folder1',
  };

  it('should correctly add and delete events', () => {
    const { result } = renderHook(() => useEventStore());

    // create events
    act(() => {
      result.current.addEvent(openNewFlowTestEvent);
      result.current.addEvent(openSavedFlowTestEvent);
    });
    expect(result.current.events).toEqual([openNewFlowTestEvent, openSavedFlowTestEvent]);

    // remove events
    act(() => {
      result.current.removeEvent(openNewFlowTestEvent.id);
    });
    expect(result.current.events).toEqual([openSavedFlowTestEvent]);

    act(() => {
      result.current.removeEvent(openSavedFlowTestEvent.id);
    });
    expect(result.current.events).toEqual([]);
  });
});
