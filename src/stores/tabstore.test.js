import { act, renderHook } from '@testing-library/react';
import { useTabStore } from './TabStore';

describe('Tab store', () => {
  const flowtest = {
    id: '1',
    name: 'test',
    pathname: '/parent/collection/test.flow',
  };

  const flowtest1 = {
    id: '2',
    name: 'test1',
    pathname: '/parent/collection1/test1.flow',
  };

  const flowtest2 = {
    id: '3',
    name: 'test2',
    pathname: '/parent/collection1/test2.flow',
  };

  const env = {
    id: '9',
    name: 'test',
    pathname: '/parent/collection1/environments/test.env',
  };

  const collectionId = '1234';
  const collectionId1 = '12345';

  it('should correctly add and delete tabs', () => {
    const { result } = renderHook(() => useTabStore());

    // create new flowtest tab
    act(() => {
      result.current.addFlowTestTab(flowtest, collectionId);
    });
    let tabs = result.current.tabs;
    expect(tabs[0].id).toEqual(flowtest.id);
    expect(tabs[0].collectionId).toEqual(collectionId);
    expect(tabs[0].type).toEqual('flowtest');
    expect(tabs[0].name).toEqual(flowtest.name);
    expect(tabs[0].pathname).toEqual(flowtest.pathname);
    expect(tabs[0].isDirty).toEqual(false);
    expect(tabs[0].flowData).toEqual(undefined);
    expect(result.current.focusTabId).toEqual(flowtest.id);

    // create new flowtest tab for different collection
    act(() => {
      result.current.addFlowTestTab(flowtest1, collectionId1);
      result.current.addFlowTestTab(flowtest2, collectionId1);
    });
    expect(result.current.focusTabId).toEqual(flowtest2.id);

    act(() => {
      result.current.addEnvTab(env, collectionId1);
    });
    expect(result.current.focusTabId).toEqual(env.id);

    act(() => {
      result.current.closeTab(env.id, collectionId1);
    });
    expect(result.current.focusTabId).toEqual(flowtest2.id);

    act(() => {
      result.current.closeTab(flowtest2.id, collectionId1);
    });
    expect(result.current.focusTabId).toEqual(flowtest1.id);

    act(() => {
      result.current.closeTab(flowtest1.id, collectionId1);
    });
    expect(result.current.focusTabId).toEqual(flowtest.id);
  });

  it('should correctly close all tabs of a collection', () => {
    const { result } = renderHook(() => useTabStore());

    act(() => {
      for (let i = 0; i < 3; i++) {
        result.current.addFlowTestTab(
          {
            id: `${i}`,
            name: `test${i}`,
            pathname: `/parent/collection/test${i}.flow`,
          },
          collectionId1,
        );
      }
    });
    expect(result.current.tabs.length).toEqual(4);

    act(() => {
      result.current.closeCollectionTabs(collectionId1);
    });
    expect(result.current.tabs.length).toEqual(1);
    expect(result.current.focusTabId).toEqual(flowtest.id);
  });

  it('should correctly close a set of tabs', () => {
    const { result } = renderHook(() => useTabStore());

    act(() => {
      for (let i = 0; i < 3; i++) {
        result.current.addFlowTestTab(
          {
            id: `${i}`,
            name: `test${i}`,
            pathname: `/parent/collection/test${i}.flow`,
          },
          collectionId1,
        );
      }
    });
    expect(result.current.tabs.length).toEqual(4);

    act(() => {
      result.current.closeTabs(['0', '2'], collectionId1);
    });
    expect(result.current.tabs.length).toEqual(2);
    expect(result.current.focusTabId).toEqual('1');
  });
});
