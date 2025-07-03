"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedTransactions = exports.getMobileDashboard = void 0;
const mobileViewService_1 = require("../services/mobileViewService");
const getMobileDashboard = async (req, res) => {
    try {
        // For demo, use userId=1. In real app, get from auth/session.
        const userId = 1;
        const dashboard = await (0, mobileViewService_1.getMobileDashboardData)(userId);
        res.json(dashboard);
    }
    catch (error) {
        console.error('Error fetching mobile dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMobileDashboard = getMobileDashboard;
const getPaginatedTransactions = async (req, res) => {
    try {
        const userId = 1; // For demo
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const data = await (0, mobileViewService_1.getTransactionsPaginated)(userId, page, limit);
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching paginated transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getPaginatedTransactions = getPaginatedTransactions;
