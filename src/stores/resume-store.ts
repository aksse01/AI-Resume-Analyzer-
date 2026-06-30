"use client";

import { create } from "zustand";
import type { AnalysisPayload, ResumeSuggestion } from "@/types/resume";

type ResumeState = {
  payload?: AnalysisPayload;
  setPayload: (payload: AnalysisPayload) => void;
  updateSuggestion: (id: string, accepted: boolean) => void;
};

export const useResumeStore = create<ResumeState>((set) => ({
  setPayload: (payload) => set({ payload }),
  updateSuggestion: (id, accepted) =>
    set((state) => {
      if (!state.payload) return state;
      const suggestions: ResumeSuggestion[] = state.payload.analysis.suggestions.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, accepted } : suggestion
      );
      return {
        payload: {
          ...state.payload,
          analysis: { ...state.payload.analysis, suggestions }
        }
      };
    })
}));
