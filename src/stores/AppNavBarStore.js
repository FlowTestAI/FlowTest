import { create } from 'zustand';
import { AppNavBarItems } from 'constants/AppNavBar';

const useNavigationStore = create((set) => ({
  selectedNavVal: AppNavBarItems.collections.value, // default value
  collapseNavBar: false,
  setNavState: (selectedVal) => set(() => ({ selectedNavVal: selectedVal })),
  setNavCollapseState: (collapseNavBarValue) => set(() => ({ collapseNavBar: collapseNavBarValue })),
}));

export default useNavigationStore;
