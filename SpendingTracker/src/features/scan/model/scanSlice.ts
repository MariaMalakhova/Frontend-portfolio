import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ScanStatus = 'idle' | 'processing' | 'ready' | 'error';

export interface TransactionDraft {
  amount?: number;
  date?: string;
  merchant?: string;
  categoryId?: string;
  note?: string;
}

interface ScanState {
  status: ScanStatus;
  imageDataUrl: string | undefined;
  ocrText: string | undefined;
  draft: TransactionDraft;
  error: string | undefined;
}

const initialState: ScanState = {
  status: 'idle',
  imageDataUrl: undefined,
  ocrText: undefined,
  draft: {},
  error: undefined,
};

const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    imageSelected(state, action: PayloadAction<string>) {
      state.imageDataUrl = action.payload;
      state.status = 'idle';
      state.ocrText = undefined;
      state.draft = {};
      state.error = undefined;
    },
    scanStarted(state) {
      state.status = 'processing';
      state.error = undefined;
    },
    scanFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    scanSucceeded(
      state,
      action: PayloadAction<{ text: string; draft: TransactionDraft }>
    ) {
      state.status = 'ready';
      state.ocrText = action.payload.text;
      state.draft = action.payload.draft;
    },
    draftUpdated(state, action: PayloadAction<Partial<TransactionDraft>>) {
      state.draft = { ...state.draft, ...action.payload };
    },
    resetScan() {
      return initialState;
    },
  },
});

export const {
  imageSelected,
  scanStarted,
  scanFailed,
  scanSucceeded,
  draftUpdated,
  resetScan,
} = scanSlice.actions;
export default scanSlice.reducer;
