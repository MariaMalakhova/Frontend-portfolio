import type { TransactionDraft } from '../model/scanSlice.ts';

export function parseReceiptText(text: string): TransactionDraft {
  const cleaned = text.replace(/\s+/g, ' ').trim();

  const totalMatch =
    cleaned.match(/total[:\s]*([0-9]+[.,][0-9]{2})/i) ??
    cleaned.match(/amount[:\s]*([0-9]+[.,][0-9]{2})/i) ??
    cleaned.match(/suma[:\s]*([0-9]+[.,][0-9]{2})/i);

  const amount =
    totalMatch?.[1] != null
      ? Number(totalMatch[1].replace(',', '.'))
      : undefined;

  const dateMatch =
    cleaned.match(/\b(20\d{2})[-/.](\d{2})[-/.](\d{2})\b/) ??
    cleaned.match(/\b(\d{2})[-/.](\d{2})[-/.](20\d{2})\b/);

  let date: string | undefined;
  if (dateMatch) {
    if (dateMatch[1].startsWith('20')) {
      date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
    } else {
      date = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
    }
  }

  const firstLine = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length >= 3);

  return {
    amount,
    date,
    merchant: firstLine,
    note: 'Scanned receipt',
  };
}
