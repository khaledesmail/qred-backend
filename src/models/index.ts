import { Sequelize } from 'sequelize-typescript';
import { User } from './user';
import { Card } from './card';
import { Transaction } from './transaction';

const sequelize = new Sequelize({
  // ...your config here
  models: [User, Card, Transaction],
});

export { sequelize, User, Card, Transaction };