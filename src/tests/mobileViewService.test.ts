jest.mock('../config/sequelize', () => ({
  sequelize: {}
}));
jest.mock('../models/user', () => ({
  User: { findByPk: jest.fn() }
}));
jest.mock('../models/card', () => ({
  Card: { findOne: jest.fn() }
}));
jest.mock('../models/transaction', () => ({
  Transaction: {
    findAll: jest.fn(),
    count: jest.fn(),
    sum: jest.fn(),
    findAndCountAll: jest.fn()
  }
}));

import { getMobileDashboardData, getTransactionsPaginated } from '../services/mobileViewService';
import { User } from '../models/user';
import { Card } from '../models/card';
import { Transaction } from '../models/transaction';

describe('mobileViewService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMobileDashboardData', () => {
    it('should return dashboard data', async () => {
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce({
        id: 1,
        name: 'Test User',
        company: 'Company AB',
      } as any);
      jest.spyOn(Card, 'findOne').mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        image: 'url',
        activated: true,
        spend_limit: 10000,
      } as any);
      jest.spyOn(Transaction, 'findAll').mockResolvedValueOnce([
        { data: 'desc', points: 'cat', created_at: '', amount: 100 },
      ] as any);
      jest.spyOn(Transaction, 'count').mockResolvedValueOnce(1);
      jest.spyOn(Transaction, 'sum').mockResolvedValueOnce(100);
      const result = await getMobileDashboardData(1);
      expect(result.companyName).toBe('Company AB');
      expect(result.cardArtUrl).toBe('url');
      expect(result.availableCredit.limit).toBe(10000);
      expect(Array.isArray(result.recentTransactions)).toBe(true);
    });

    it('should handle empty user', async () => {
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);
      await expect(getMobileDashboardData(1)).rejects.toThrow();
    });
  });

  describe('getTransactionsPaginated', () => {
    it('should return paginated transactions', async () => {
      jest.spyOn(Transaction, 'findAndCountAll').mockResolvedValueOnce({
        rows: [{ data: 'desc', points: 'cat', created_at: '', amount: 100 }],
        count: 1,
      } as any);
      const result = await getTransactionsPaginated(1, 1, 10);
      expect(result.total).toBe(1);
      expect(Array.isArray(result.transactions)).toBe(true);
      expect(result.hasMore).toBe(false);
    });

    it('should return empty transactions if no transactions', async () => {
      jest.spyOn(Transaction, 'findAndCountAll').mockResolvedValueOnce({
        rows: [],
        count: 0,
      } as any);
      const result = await getTransactionsPaginated(1, 1, 10);
      expect(result.total).toBe(0);
      expect(result.transactions).toEqual([]);
      expect(result.hasMore).toBe(false);
    });

    it('should throw on db error', async () => {
      jest.spyOn(Transaction, 'findAndCountAll').mockRejectedValueOnce(new Error('DB error'));
      await expect(getTransactionsPaginated(1, 1, 10)).rejects.toThrow('DB error');
    });
  });
}); 