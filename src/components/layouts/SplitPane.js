import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import Workspace from '../organisms/workspace/Workspace';
import AppNavBar from 'components/organisms/AppNavBar';
import SideBar from 'components/organisms/SideBar';
import useNavigationStore from 'stores/AppNavBarStore';
import { AppNavBarStyles } from 'constants/AppNavBar';

const SplitPane = () => {
  const isNavBarCollapsed = useNavigationStore((state) => state.collapseNavBar);
  return (
    <main className='h-full'>
      <Allotment>
        <Allotment.Pane
          preferredSize={isNavBarCollapsed ? AppNavBarStyles.collapsedNavBarWidth.absolute : 450}
          minSize={isNavBarCollapsed ? AppNavBarStyles.collapsedNavBarWidth.absolute : 450}
          maxSize={isNavBarCollapsed ? AppNavBarStyles.collapsedNavBarWidth.absolute : 600}
          separator={isNavBarCollapsed ? false : true}
        >
          <div className='flex h-full text-xs'>
            <AppNavBar />
            {!isNavBarCollapsed ? (
              <div className='w-full h-full'>
                <Allotment>
                  <Allotment.Pane>
                    <SideBar />
                  </Allotment.Pane>
                </Allotment>
              </div>
            ) : (
              ''
            )}
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <Workspace />
        </Allotment.Pane>
      </Allotment>
    </main>
  );
};

export default SplitPane;
