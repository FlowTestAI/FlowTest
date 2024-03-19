import { create } from 'zustand';
import { AppNavBarItems } from 'constants/AppNavBar';

const useNavigationStore = create((set) => ({
  selectedNavVal: AppNavBarItems.collections.value, // default value
  setNavState: (selectedVal) => set(() => ({ selectedNavVal: selectedVal })),
}));

export default useNavigationStore;
