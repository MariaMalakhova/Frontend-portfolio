import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CurrencyCode = 'PLN' | 'USD' | 'EUR';

export type TransactionType = 'expense' | 'income';

export interface UiFilters {
  query: string;
  categoryId: string | undefined;
  type: TransactionType | undefined;
}

const initialMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
})();

const initialState = {
  activeMonth: initialMonth,
  currency: 'PLN' as CurrencyCode,
  filters: {
    query: '',
    categoryId: undefined as string | undefined,
    type: undefined as TransactionType | undefined,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveMonth(state, action: PayloadAction<string>) {
      state.activeMonth = action.payload;
    },
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.currency = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<UiFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setActiveMonth, setCurrency, setFilters } = uiSlice.actions;
export default uiSlice.reducer;
