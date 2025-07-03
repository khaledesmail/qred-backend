"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mobileViewController_1 = require("../controllers/mobileViewController");
const router = (0, express_1.Router)();
router.get('/', mobileViewController_1.getMobileDashboard);
router.get('/transactions', mobileViewController_1.getPaginatedTransactions);
exports.default = router;
