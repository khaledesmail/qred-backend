import { User } from '../models/user';
import { Card } from '../models/card';
import { Transaction } from '../models/transaction';
import '../config/sequelize';

export const getCompanyCardData = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  const card = await Card.findOne({ where: { user_id: userId } });
  if (!card) throw new Error('Card not found');
  return {
    companyName: user.company,
    cardArtUrl: card.image,
    isCardActive: card.activated,
    hasSupportContact: true,
  };
};

export const getCreditData = async (userId: number) => {
  const card = await Card.findOne({ where: { user_id: userId } });
  if (!card) throw new Error('Card not found');
  const spent = (await Transaction.sum('amount', { where: { user_id: userId } })) || 0;
  return {
    availableCredit: {
      used: spent,
      limit: card.spend_limit,
      currency: 'kr',
    },
    hasInvoiceDue: true,
  };
};

export const getMobileDashboardData = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const card = await Card.findOne({ where: { user_id: userId } });
  if (!card) throw new Error('Card not found');

  const recentTransactions = await Transaction.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 3,
    attributes: ['data', 'points', 'created_at', 'amount'],
  });

  const totalTx = await Transaction.count({ where: { user_id: userId } });
  const additionalTransactionCount = Math.max(0, totalTx - 3);

  const spent = (await Transaction.sum('amount', { where: { user_id: userId } })) || 0;

  return {
    companyName: user.company,
    hasInvoiceDue: true,
    cardArtUrl: card.image,
    availableCredit: {
      used: spent,
      limit: card.spend_limit,
      currency: 'kr',
    },
    recentTransactions,
    additionalTransactionCount,
    isCardActive: card.activated,
    hasSupportContact: true,
  };
};

export const getTransactionsPaginated = async (userId: number, page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const { rows, count: total } = await Transaction.findAndCountAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit,
    offset,
    attributes: ['data', 'points', 'created_at', 'amount'],
  });
  const hasMore = page * limit < total;
  const remainingCount = Math.max(0, total - (page * limit));
  return {
    transactions: rows,
    total,
    page,
    limit,
    hasMore,
    remainingCount,
  };
}; 