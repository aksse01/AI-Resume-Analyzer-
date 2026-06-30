import type { ResumeSuggestion } from "@/types/resume";

export type AIProviderName = "demo" | "openai-compatible" | "custom";

export type AIRequestContext = {
  promptVersion: string;
  timeoutMs: number;
  redacted: boolean;
};

export type AIProvider = {
  name: AIProviderName;
  generateAlternatives(input: {
    text: string;
    instruction: string;
    context: AIRequestContext;
  }): Promise<string[]>;
  estimateUsage(inputTokens: number, outputTokens: number): {
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
  };
};

export const demoAIProvider: AIProvider = {
  name: "demo",
  async generateAlternatives({ text, instruction }) {
    const base = text.trim().replace(/\s+/g, " ");
    return [
      `${instruction}: ${base}`,
      base.replace(/^Worked on/i, "Contributed to").replace(/^Responsible for/i, "Managed"),
      base.length > 140 ? `${base.slice(0, 137)}...` : base
    ];
  },
  estimateUsage(inputTokens, outputTokens) {
    return { inputTokens, outputTokens, estimatedCostUsd: 0 };
  }
};

export function getAIProvider(): AIProvider {
  return demoAIProvider;
}

export function redactsSensitiveContent(text: string) {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[redacted-phone]");
}

export function suggestionsAreSafe(suggestions: ResumeSuggestion[]) {
  return suggestions.every((suggestion) => suggestion.factualRisk !== "high" || suggestion.requiresConfirmation);
}
