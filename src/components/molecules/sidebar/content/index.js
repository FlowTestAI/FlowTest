import React from 'react';
import PropTypes from 'prop-types';
import useNavigationStore from 'stores/AppNavBarStore';
import { AppNavBarItems } from 'constants/AppNavBar';
import Collections from './Collections';
import Environments from './Environments';
import SideBarSubHeader from 'components/molecules/headers/SideBarSubHeader';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';

const Content = ({ collections }) => {
  const navigationSelectedValue = useNavigationStore((state) => state.selectedNavVal);
  return (
    <>
      {navigationSelectedValue === AppNavBarItems.collections.value ? (
        <>
          <SideBarSubHeader />
          <HorizontalDivider />
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
