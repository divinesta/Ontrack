type JournalEntry = {
  id: string;
  text: string;
  timestamp: number;
  status: "sending" | "processing" | "ready";
};

type MockConfig = {
  processingDelayMs?: number;
};

let entryCounter = 0;

export function createMockEntry(text: string): JournalEntry {
  entryCounter += 1;
  return {
    id: `entry-${Date.now()}-${entryCounter}`,
    text,
    timestamp: Date.now(),
    status: "sending",
  };
}

export function simulateProcessing(
  config: MockConfig = {}
): Promise<void> {
  const delay = config.processingDelayMs ?? 1800;

  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function simulateSave(): Promise<{ success: boolean; id: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, id: `saved-${Date.now()}` });
    }, 600);
  });
}

export function simulateRefine(
  originalText: string
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const refined = originalText
        .replace(/i /gi, "I ")
        .replace(/\bi'm\b/gi, "I'm")
        .trim();
      const suffix =
        " — and what I'm realizing is that this connects to something deeper about how I show up.";
      resolve(refined + suffix);
    }, 1400);
  });
}
