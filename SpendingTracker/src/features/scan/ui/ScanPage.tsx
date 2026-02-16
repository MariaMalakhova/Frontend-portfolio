import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  draftUpdated,
  imageSelected,
  scanFailed,
  scanStarted,
  scanSucceeded,
  resetScan,
} from '../model/scanSlice.ts';
import { runOcr } from '../lib/ocr.ts';
import { parseReceiptText } from '../lib/parseReceipt.ts';
import { useCreateTransactionMutation } from '../../transactions/api/transactionsApi.ts';
import { CATEGORIES } from '../../../shared/constants/categories.ts';
import { useToast } from '../../../shared/ui/ToastContext.tsx';
import styles from './ScanPage.module.css';
import { Typography } from '@mui/material';

const SAVE_ERROR_MSG = 'Unable to save transaction. Please, try again later.';

export function ScanPage() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const scan = useAppSelector((s) => s.scan);
  const [progress, setProgress] = useState(0);
  const [createTransaction, { isLoading: isSaving }] =
    useCreateTransactionMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch(imageSelected(String(reader.result)));
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!scan.imageDataUrl) return;
    try {
      setProgress(0);
      dispatch(scanStarted());
      const text = await runOcr(scan.imageDataUrl, (p) => setProgress(p));
      const draft = parseReceiptText(text);
      dispatch(scanSucceeded({ text, draft }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'OCR failed';
      dispatch(scanFailed(msg));
      showToast(msg);
    }
  };

  const handleSaveAsTransaction = async () => {
    const d = scan.draft;
    if (d.amount == null || d.amount <= 0 || !d.date) {
      showToast('Please set amount and date.', 'warning');
      return;
    }
    try {
      await createTransaction({
        type: 'expense',
        amount: d.amount,
        currency: 'PLN',
        date: d.date,
        categoryId: d.categoryId ?? 'other',
        merchant: d.merchant ?? null,
        note: d.note ?? null,
      }).unwrap();
      dispatch(resetScan());
    } catch {
      showToast(SAVE_ERROR_MSG);
    }
  };

  return (
    <div className={styles.page}>
      <Typography variant="h6" fontWeight={600} margin="10px 0">
        Smart Scan
      </Typography>

      <label className={styles.fileLabel}>
        <span className={styles.fileLabelText}>Take photo or choose image</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </label>

      {scan.imageDataUrl && (
        <img
          src={scan.imageDataUrl}
          alt="Receipt preview"
          className={styles.preview}
        />
      )}

      <button
        type="button"
        disabled={!scan.imageDataUrl || scan.status === 'processing'}
        onClick={handleScan}
        className={styles.scanButton}
      >
        {scan.status === 'processing' ? 'Scanning…' : 'Scan receipt'}
      </button>

      {scan.status === 'processing' && (
        <div className={styles.progress}>
          Progress: {Math.round(progress * 100)}%
        </div>
      )}

      {scan.status === 'error' && (
        <div className={styles.error}>{scan.error}</div>
      )}

      {scan.status === 'ready' && (
        <div className={styles.review}>
          <div className={styles.reviewTitle}>Review & save</div>

          <label className={styles.reviewLabel}>
            Amount *
            <input
              type="number"
              step="0.01"
              min="0"
              className={styles.reviewInput}
              value={scan.draft.amount ?? ''}
              onChange={(e) =>
                dispatch(
                  draftUpdated({ amount: parseFloat(e.target.value) || undefined })
                )
              }
            />
          </label>

          <label className={styles.reviewLabel}>
            Date *
            <input
              type="date"
              className={styles.reviewInput}
              value={scan.draft.date ?? ''}
              onChange={(e) =>
                dispatch(draftUpdated({ date: e.target.value }))
              }
            />
          </label>

          <label className={styles.reviewLabel}>
            Merchant
            <input
              type="text"
              className={styles.reviewInput}
              value={scan.draft.merchant ?? ''}
              onChange={(e) =>
                dispatch(draftUpdated({ merchant: e.target.value }))
              }
            />
          </label>

          <label className={styles.reviewLabel}>
            Category
            <select
              className={styles.reviewSelect}
              value={scan.draft.categoryId ?? 'other'}
              onChange={(e) =>
                dispatch(draftUpdated({ categoryId: e.target.value }))
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.reviewLabel}>
            Note
            <input
              type="text"
              className={styles.reviewInput}
              value={scan.draft.note ?? ''}
              onChange={(e) =>
                dispatch(draftUpdated({ note: e.target.value }))
              }
            />
          </label>

          <div className={styles.reviewActions}>
            <button
              type="button"
              onClick={() => dispatch(resetScan())}
              className={styles.discardButton}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveAsTransaction}
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? 'Saving…' : 'Save as transaction'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
