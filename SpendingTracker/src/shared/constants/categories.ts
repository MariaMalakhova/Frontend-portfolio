export const CATEGORIES = [
  { id: 'food', label: 'Food & Groceries' },
  { id: 'transport', label: 'Transport' },
  { id: 'housing', label: 'Housing' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'health', label: 'Health' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'other', label: 'Other' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
