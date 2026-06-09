export type TrackerFieldType = "number" | "currency" | "duration" | "count" | "boolean" | "rating" | "text";

export type TrackerField = {
  key: string;
  label: string;
  type: TrackerFieldType;
  unit?: string;
};

export type LifeArea = {
  key: string;
  name: string;
  emoji: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  fields: TrackerField[];
  records: string;
};

export const lifeAreas: LifeArea[] = [
  {
    key: "workout",
    name: "Workout",
    emoji: "🏋️",
    frequency: "daily",
    records: "12 records",
    fields: [
      { key: "duration", label: "Duration", type: "duration", unit: "min" },
      { key: "intensity", label: "Intensity", type: "rating" },
    ],
  },
  {
    key: "spending",
    name: "Spending",
    emoji: "💸",
    frequency: "daily",
    records: "8 records",
    fields: [
      { key: "amount", label: "Amount", type: "currency", unit: "NGN" },
      { key: "note", label: "Note", type: "text" },
    ],
  },
  {
    key: "reading",
    name: "Reading",
    emoji: "📖",
    frequency: "weekly",
    records: "5 records",
    fields: [
      { key: "time", label: "Time", type: "duration", unit: "hr" },
      { key: "pages", label: "Pages", type: "count" },
    ],
  },
  {
    key: "evangelism",
    name: "Evangelism",
    emoji: "🤝",
    frequency: "custom",
    records: "2 records",
    fields: [
      { key: "went", label: "Went out", type: "boolean" },
      { key: "people", label: "People", type: "count" },
    ],
  },
];

export const fieldTypes = [
  { type: "number", label: "Number", icon: "calculator-outline" as const },
  { type: "currency", label: "Currency", icon: "cash-outline" as const },
  { type: "boolean", label: "Yes/No", icon: "toggle-outline" as const },
  { type: "duration", label: "Duration", icon: "timer-outline" as const },
  { type: "rating", label: "Rating", icon: "speedometer-outline" as const },
  { type: "text", label: "Text", icon: "text-outline" as const },
];

export const extractionExamples = [
  {
    text: "I worked out for 30 minutes and spent 2500 on food and transport.",
    records: ["Workout: 30 min", "Spending: NGN 2.5k"],
  },
  {
    text: "Read for two hours after class, mostly biology notes.",
    records: ["Reading: 2 hr"],
  },
  {
    text: "Went for evangelism this evening and spoke with 4 people.",
    records: ["Evangelism: 4 people"],
  },
];
