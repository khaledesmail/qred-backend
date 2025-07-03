"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsPaginated = exports.getMobileDashboardData = void 0;
const config_1 = __importDefault(require("../config/config"));
const getMobileDashboardData = async (userId) => {
    // Fetch user/company info
    const userResult = await config_1.default.query('SELECT id, company AS company_name FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    // Fetch card info
    const cardResult = await config_1.default.query('SELECT id, image AS card_art_url, activated AS is_active, spend_limit FROM cards WHERE user_id = $1', [userId]);
    const card = cardResult.rows[0];
    // Fetch latest 3 transactions
    const txResult = await config_1.default.query('SELECT data AS description, points AS category, created_at, amount FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3', [userId]);
    const recentTransactions = txResult.rows;
    // Count more transactions
    const countResult = await config_1.default.query('SELECT COUNT(*) FROM transactions WHERE user_id = $1', [userId]);
    const totalTx = parseInt(countResult.rows[0].count, 10);
    const additionalTransactionCount = Math.max(0, totalTx - 3);
    // Fetch available credit (sum of transaction amounts)
    const spendResult = await config_1.default.query('SELECT COALESCE(SUM(amount), 0) as spent FROM transactions WHERE user_id = $1', [userId]);
    const spent = parseInt(spendResult.rows[0].spent, 10);
    return {
        companyName: user.company_name,
        hasInvoiceDue: true, // Placeholder, can be fetched/calculated
        cardArtUrl: card.card_art_url,
        availableCredit: {
            used: spent,
            limit: card.spend_limit,
            currency: 'kr',
        },
        recentTransactions,
        additionalTransactionCount,
        isCardActive: card.is_active,
        hasSupportContact: true, // Placeholder
    };
};
exports.getMobileDashboardData = getMobileDashboardData;
const getTransactionsPaginated = async (userId, page, limit) => {
    const offset = (page - 1) * limit;
    const txResult = await config_1.default.query('SELECT data AS description, points AS category, created_at, amount FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
    const countResult = await config_1.default.query('SELECT COUNT(*) FROM transactions WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].count, 10);
    return {
        total,
        page,
        limit,
        results: txResult.rows,
    };
};
exports.getTransactionsPaginated = getTransactionsPaginated;
