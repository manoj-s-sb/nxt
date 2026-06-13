import { create } from "zustand";

import type { UserResponse } from "@/api/auth";

interface UserState {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
