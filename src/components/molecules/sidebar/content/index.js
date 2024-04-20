import React from 'react';
import PropTypes from 'prop-types';
import useNavigationStore from 'stores/AppNavBarStore';
import { AppNavBarItems } from 'constants/AppNavBar';
import Collections from './Collections';
import Environments from './Environments';
import SideBarSubHeader from 'components/molecules/headers/SideBarSubHeader';

const Content = ({ collections }) => {
  const navigationSelectedValue = useNavigationStore((state) => state.selectedNavVal);
  return (
    <>
      {navigationSelectedValue === AppNavBarItems.collections.value ? (
        <>
          <SideBarSubHeader />
          <Collections collections={collections} />
        </>
      ) : (
        <Environments collections={collections} />
      )}
    </>
  );
};

Content.propTypes = {
  collections: PropTypes.array.isRequired,
};

export default Content;
