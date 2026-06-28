const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export type OcrBlock = {
  text: string;
  confidence: number;
  bounding_box: unknown[];
};

export type Transaction = {
  id: string;
  amount: number;
  transaction_date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  confidence_score?: number;
  status?: string;
};

export type ReportSummary = {
  source: string;
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
  recent_transactions: Transaction[];
  categories: { category: string; amount: number }[];
  message?: string;
};

export type OcrExtractResponse = {
  full_text: string;
  source: string;
  blocks: OcrBlock[];
};

export type ParseTransactionResponse = {
  parsed_data: Omit<Transaction, 'id'>;
  record: Transaction | null;
  saved: boolean;
  save_error?: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const buildMonthSummaryPath = (fromDate: string, toDate: string) =>
  `/api/v1/reports/summary?date_from=${encodeURIComponent(fromDate)}&date_to=${encodeURIComponent(toDate)}`;

const buildAuthHeaders = (token: string, headers?: HeadersInit): HeadersInit => ({
  ...headers,
  Authorization: `Bearer ${token}`,
});

const requestJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.detail || errorBody?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return response.json();
};

const buildReceiptUploadBody = (imageUri: string) => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'receipt.jpg',
  } as unknown as Blob);

  return formData;
};

export const uploadReceipt = async (imageUri: string) => {
  return requestJson<OcrExtractResponse>('/api/v1/ocr/extract', {
    method: 'POST',
    body: buildReceiptUploadBody(imageUri),
  });
};

const buildParseTransactionBody = (rawText: string, receiptId?: string) => {
  const bodyData: {
    raw_text: string;
    receipt_id?: string;
  } = {
    raw_text: rawText,
  };
  if (receiptId) {
    bodyData.receipt_id = receiptId;
  }

  return bodyData;
};

export const parseTransaction = async (rawText: string, accessToken: string, receiptId?: string) => {
  return requestJson<ParseTransactionResponse>('/api/v1/transactions/parse', {
    method: 'POST',
    headers: buildAuthHeaders(accessToken, {
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(buildParseTransactionBody(rawText, receiptId)),
  });
};

export const fetchTransactions = async (accessToken: string) => {
  const response = await requestJson<{ items: Transaction[] }>('/api/v1/transactions', {
    headers: buildAuthHeaders(accessToken),
  });
  return response.items;
};

export const fetchReportSummary = async (accessToken: string, fromDate: string, toDate: string) => {
  return requestJson<ReportSummary>(buildMonthSummaryPath(fromDate, toDate), {
    headers: buildAuthHeaders(accessToken),
  });
};
