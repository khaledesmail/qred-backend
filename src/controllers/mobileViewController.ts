import { Request, Response } from 'express';
import { getCompanyCardData, getCreditData, getTransactionsPaginated } from '../services/mobileViewService';

export const getCompanyCard = async (req: Request, res: Response) => {
  try {
    const userId = 1; // For demo
    const data = await getCompanyCardData(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCredit = async (req: Request, res: Response) => {
  try {
    const userId = 1; // For demo
    const data = await getCreditData(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaginatedTransactions = async (req: Request, res: Response) => {
  try {
    const userId = 1; // For demo
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const data = await getTransactionsPaginated(userId, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
