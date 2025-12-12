import { create } from "zustand";


export const useSectionStore = create((set) => ({
    currentSection: "dashboard",
    setSection: (section) => set(() => ({ currentSection: section })),
}));




