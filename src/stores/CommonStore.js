import { create } from 'zustand';

const useCommonStore = create((set) => ({
  showLoader: false, // default value
  setShowLoader: (showLoaderValue) => set(() => ({ showLoader: showLoaderValue })),
}));

export default useCommonStore;
