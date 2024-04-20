import React from 'react';
import useCollectionStore from 'stores/CollectionStore';
import SideBarHeader from 'components/molecules/headers/SideBarHeader';
import Empty from 'components/molecules/sidebar/Empty';
import Content from 'components/molecules/sidebar/content';

const SideBar = () => {
  const collections = useCollectionStore((state) => state.collections);
  return (
    <div className='flex-auto overflow-scroll'>
      <SideBarHeader />
      <>{collections.length != 0 ? <Content collections={collections} /> : <Empty />}</>
    </div>
  );
};

export default SideBar;
