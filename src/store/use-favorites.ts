"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteItem = {
  roll: string;
  name: string;
  instituteName: string;
  departmentName: string;
  semester: number;
  gpa: number;
  letterGrade: string;
  result: "PASSED" | "FAILED";
  addedAt: string;
};

type FavoritesState = {
  items: FavoriteItem[];
  add: (item: Omit<FavoriteItem, "addedAt">) => void;
  remove: (roll: string) => void;
  has: (roll: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (get().items.some((i) => i.roll === item.roll)) return;
        set({
          items: [{ ...item, addedAt: new Date().toISOString() }, ...get().items],
        });
      },
      remove: (roll) =>
        set({ items: get().items.filter((i) => i.roll !== roll) }),
      has: (roll) => get().items.some((i) => i.roll === roll),
      clear: () => set({ items: [] }),
    }),
    { name: "bteb-favorites" }
  )
);
