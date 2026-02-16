import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type { Transaction, TransactionCreate, TransactionUpdate } from '../model/types.ts';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Transactions'],
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], string | void>({
      query: (month) => ({
        url: '/api/transactions',
        params: month ? { month } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Transactions' as const, id })),
              { type: 'Transactions', id: 'LIST' },
            ]
          : [{ type: 'Transactions', id: 'LIST' }],
    }),
    createTransaction: builder.mutation<Transaction, TransactionCreate>({
      query: (body) => ({
        url: '/api/transactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Transactions', id: 'LIST' }],
    }),
    updateTransaction: builder.mutation<Transaction, { id: string; body: TransactionUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/transactions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Transactions', id },
        { type: 'Transactions', id: 'LIST' },
      ],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Transactions', id },
        { type: 'Transactions', id: 'LIST' },
      ],
    }),
    uploadReceipt: builder.mutation<
      { receiptPath: string; url: string },
      { transactionId: string; image: string }
    >({
      query: (body) => ({
        url: '/api/receipts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Transactions', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useUploadReceiptMutation,
} = transactionsApi;
