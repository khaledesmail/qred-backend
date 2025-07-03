import request from 'supertest';
import express from 'express';
import mobileViewRouter from '../routes/mobileViewRoutes';

const mockService = require('../services/mobileViewService');

jest.mock('../services/mobileViewService', () => ({
  getCompanyCardData: jest.fn().mockResolvedValue({
    companyName: 'Company AB',
    cardArtUrl: 'https://via.placeholder.com/150',
    isCardActive: true,
    hasSupportContact: true,
  }),
  getCreditData: jest.fn().mockResolvedValue({
    availableCredit: { used: 5400, limit: 10000, currency: 'kr' },
    hasInvoiceDue: true,
  }),
  getRecentTransactionsData: jest.fn().mockResolvedValue({
    recentTransactions: [
      { data: 'Transaction data', points: 'Data points', created_at: '2024-07-03T12:00:00Z', amount: 2000 },
      { data: 'Transaction data', points: 'Data points', created_at: '2024-07-02T12:00:00Z', amount: 1800 },
      { data: 'Transaction data', points: 'Data points', created_at: '2024-07-01T12:00:00Z', amount: 1600 }
    ],
    additionalTransactionCount: 54,
  }),
  getTransactionsPaginated: jest.fn().mockResolvedValue({
    total: 57,
    page: 1,
    limit: 3,
    transactions: [
      { data: 'Transaction data', points: 'Data points', created_at: '2024-07-03T12:00:00Z', amount: 2000 },
      { data: 'Transaction data', points: 'Data points', created_at: '2024-07-02T12:00:00Z', amount: 1800 },
      { data: 'Transaction data', points: 'Data points', created_at: '2024-07-01T12:00:00Z', amount: 1600 },
    ],
    hasMore: true,
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/mobile-view', mobileViewRouter);

describe('GET /api/mobile-view/company-card', () => {
  it('should return company and card info', async () => {
    const res = await request(app).get('/api/mobile-view/company-card');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('companyName');
    expect(res.body).toHaveProperty('cardArtUrl');
    expect(res.body).toHaveProperty('isCardActive');
    expect(res.body).toHaveProperty('hasSupportContact');
  });
});

describe('GET /api/mobile-view/credit', () => {
  it('should return credit info', async () => {
    const res = await request(app).get('/api/mobile-view/credit');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('availableCredit');
    expect(res.body).toHaveProperty('hasInvoiceDue');
  });
});

describe('GET /api/mobile-view/transactions', () => {
  it('should return paginated transactions', async () => {
    const res = await request(app).get('/api/mobile-view/transactions?page=1&limit=3');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transactions');
    expect(Array.isArray(res.body.transactions)).toBe(true);
    expect(res.body).toHaveProperty('total', 57);
    expect(res.body).toHaveProperty('hasMore', true);
  });

  it('should handle errors gracefully', async () => {
    mockService.getTransactionsPaginated.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/mobile-view/transactions?page=1&limit=3');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });

  it('should return empty transactions if there are no transactions', async () => {
    mockService.getTransactionsPaginated.mockResolvedValueOnce({ total: 0, page: 1, limit: 3, transactions: [], hasMore: false });
    const res = await request(app).get('/api/mobile-view/transactions?page=1&limit=3');
    expect(res.status).toBe(200);
    expect(res.body.transactions).toEqual([]);
    expect(res.body.total).toBe(0);
    expect(res.body.hasMore).toBe(false);
  });

  it('should support custom pagination values', async () => {
    mockService.getTransactionsPaginated.mockResolvedValueOnce({ total: 100, page: 2, limit: 5, transactions: Array(5).fill({ description: 'T', category: 'C', created_at: '', amount: 0 }), hasMore: true });
    const res = await request(app).get('/api/mobile-view/transactions?page=2&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(5);
    expect(res.body.transactions.length).toBe(5);
    expect(res.body.hasMore).toBe(true);
  });
}); 