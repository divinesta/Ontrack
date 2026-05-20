export const toDateOnly = (date: Date): string => {
   return date.toISOString().slice(0, 10);
};

export const startOfDay = (date: Date): Date => {
   const nextDate = new Date(date);
   nextDate.setHours(0, 0, 0, 0);
   return nextDate;
};

export const endOfDay = (date: Date): Date => {
   const nextDate = new Date(date);
   nextDate.setHours(23, 59, 59, 999);
   return nextDate;
};

export const addDays = (date: Date, days: number): Date => {
   const nextDate = new Date(date);
   nextDate.setDate(nextDate.getDate() + days);
   return nextDate;
};
