import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Card } from '../models/card';
import { Transaction } from '../models/transaction';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
  models: [User, Card, Transaction],
  logging: false,
}); 