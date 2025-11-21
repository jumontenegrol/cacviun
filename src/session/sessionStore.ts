import { create } from "zustand";

export interface SessionData {
  name: string;
  email: string;
  role: string;
}

interface SessionState {
  session: SessionData | null;
  setSession: (session: SessionData | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,

  setSession: (session) => set({ session }),

  clearSession: () => set({ session: null }),
}));