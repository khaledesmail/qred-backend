import { Router } from 'express';
import { getCompanyCard, getCredit, getPaginatedTransactions } from '../controllers/mobileViewController';

const router = Router();

router.get('/company-card', getCompanyCard);
router.get('/credit', getCredit);
router.get('/transactions', getPaginatedTransactions);

export default router;