import { configureStore } from '@reduxjs/toolkit';
import { transactionsApi } from '../features/transactions/api/transactionsApi.ts';
import uiReducer from '../features/ui/uiSlice.ts';
import scanReducer from '../features/scan/model/scanSlice.ts';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    scan: scanReducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
