import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,

      setSession: (session) => set({ session }),

      clearSession: () => set({ session: null }),
    }),
    {
      name: "session-storage", // clave del localStorage
      storage: createJSONStorage(() => localStorage), // 🔥 forzar el storage real
    }
  )
);