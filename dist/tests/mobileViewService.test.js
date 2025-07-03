"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobileViewService_1 = require("../services/mobileViewService");
const config_1 = __importDefault(require("../config/config"));
jest.mock('../config/config', () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
    },
}));
const mockPool = config_1.default;
describe('mobileViewService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getMobileDashboardData', () => {
        it('should return dashboard data', async () => {
            mockPool.query
                .mockResolvedValueOnce({ rows: [{ company_name: 'Company AB' }] }) // user
                .mockResolvedValueOnce({ rows: [{ card_art_url: 'url', is_active: true, spend_limit: 10000 }] }) // card
                .mockResolvedValueOnce({ rows: [{ description: 'desc', category: 'cat', created_at: '', amount: 100 }] }) // tx
                .mockResolvedValueOnce({ rows: [{ count: '1' }] }) // count
                .mockResolvedValueOnce({ rows: [{ spent: '100' }] }); // spent
            const result = await (0, mobileViewService_1.getMobileDashboardData)(1);
            expect(result.companyName).toBe('Company AB');
            expect(result.cardArtUrl).toBe('url');
            expect(result.availableCredit.limit).toBe(10000);
            expect(Array.isArray(result.recentTransactions)).toBe(true);
        });
        it('should handle empty user', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [] });
            await expect((0, mobileViewService_1.getMobileDashboardData)(1)).rejects.toThrow();
        });
    });
    describe('getTransactionsPaginated', () => {
        it('should return paginated transactions', async () => {
            mockPool.query
                .mockResolvedValueOnce({ rows: [{ description: 'desc', category: 'cat', created_at: '', amount: 100 }] }) // tx
                .mockResolvedValueOnce({ rows: [{ count: '1' }] }); // count
            const result = await (0, mobileViewService_1.getTransactionsPaginated)(1, 1, 10);
            expect(result.total).toBe(1);
            expect(Array.isArray(result.results)).toBe(true);
        });
        it('should return empty results if no transactions', async () => {
            mockPool.query
                .mockResolvedValueOnce({ rows: [] }) // tx
                .mockResolvedValueOnce({ rows: [{ count: '0' }] }); // count
            const result = await (0, mobileViewService_1.getTransactionsPaginated)(1, 1, 10);
            expect(result.total).toBe(0);
            expect(result.results).toEqual([]);
        });
        it('should throw on db error', async () => {
            mockPool.query.mockRejectedValueOnce(new Error('DB error'));
            await expect((0, mobileViewService_1.getTransactionsPaginated)(1, 1, 10)).rejects.toThrow('DB error');
        });
    });
});
