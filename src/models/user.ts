import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Card } from './card';
import { Transaction } from './transaction';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  company!: string;

  @HasMany(() => Card)
  cards!: Card[];

  @HasMany(() => Transaction)
  transactions!: Transaction[];
}
