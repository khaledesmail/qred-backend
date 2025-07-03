"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mobileViewRoutes_1 = __importDefault(require("../routes/mobileViewRoutes"));
const mockService = require('../services/mobileViewService');
jest.mock('../services/mobileViewService', () => ({
    getMobileDashboardData: jest.fn().mockResolvedValue({
        companyName: 'Company AB',
        hasInvoiceDue: true,
        cardArtUrl: 'https://via.placeholder.com/150',
        availableCredit: { used: 5400, limit: 10000, currency: 'kr' },
        recentTransactions: [
            { description: 'Transaction data', category: 'Data points', created_at: '2024-07-03T12:00:00Z', amount: 2000 },
            { description: 'Transaction data', category: 'Data points', created_at: '2024-07-02T12:00:00Z', amount: 1800 },
            { description: 'Transaction data', category: 'Data points', created_at: '2024-07-01T12:00:00Z', amount: 1600 },
        ],
        additionalTransactionCount: 54,
        isCardActive: false,
        hasSupportContact: true,
    }),
    getTransactionsPaginated: jest.fn().mockResolvedValue({
        total: 57,
        page: 1,
        limit: 3,
        results: [
            { description: 'Transaction data', category: 'Data points', created_at: '2024-07-03T12:00:00Z', amount: 2000 },
            { description: 'Transaction data', category: 'Data points', created_at: '2024-07-02T12:00:00Z', amount: 1800 },
            { description: 'Transaction data', category: 'Data points', created_at: '2024-07-01T12:00:00Z', amount: 1600 },
        ],
    }),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/mobile-view', mobileViewRoutes_1.default);
describe('GET /api/mobile-view', () => {
    it('should return the mobile dashboard data', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/mobile-view');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('companyName', 'Company AB');
        expect(res.body).toHaveProperty('recentTransactions');
        expect(Array.isArray(res.body.recentTransactions)).toBe(true);
    });
    it('should handle errors gracefully', async () => {
        mockService.getMobileDashboardData.mockRejectedValueOnce(new Error('DB error'));
        const res = await (0, supertest_1.default)(app).get('/api/mobile-view');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Internal server error');
    });
});
describe('GET /api/mobile-view/transactions', () => {
    it('should return paginated transactions', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/mobile-view/transactions?page=1&limit=3');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('results');
        expect(Array.isArray(res.body.results)).toBe(true);
        expect(res.body).toHaveProperty('total', 57);
    });
    it('should handle errors gracefully', async () => {
        mockService.getTransactionsPaginated.mockRejectedValueOnce(new Error('DB error'));
        const res = await (0, supertest_1.default)(app).get('/api/mobile-view/transactions?page=1&limit=3');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Internal server error');
    });
    it('should return empty results if there are no transactions', async () => {
        mockService.getTransactionsPaginated.mockResolvedValueOnce({ total: 0, page: 1, limit: 3, results: [] });
        const res = await (0, supertest_1.default)(app).get('/api/mobile-view/transactions?page=1&limit=3');
        expect(res.status).toBe(200);
        expect(res.body.results).toEqual([]);
        expect(res.body.total).toBe(0);
    });
    it('should support custom pagination values', async () => {
        mockService.getTransactionsPaginated.mockResolvedValueOnce({ total: 100, page: 2, limit: 5, results: Array(5).fill({ description: 'T', category: 'C', created_at: '', amount: 0 }) });
        const res = await (0, supertest_1.default)(app).get('/api/mobile-view/transactions?page=2&limit=5');
        expect(res.status).toBe(200);
        expect(res.body.page).toBe(2);
        expect(res.body.limit).toBe(5);
        expect(res.body.results.length).toBe(5);
    });
});
