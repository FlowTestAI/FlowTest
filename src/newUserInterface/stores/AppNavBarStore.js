import { create } from 'zustand';
import { AppNavBarItems } from 'newUserInterface/constants/AppNavBar';

export const useNavigationStore = create((set) => ({
  selectedNavVal: AppNavBarItems.collections.value, // default value
  setNavState: (selectedVal) => set(() => ({ selectedNavVal: selectedVal })),
}));
