import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'transactions', timestamps: false })
export class Transaction extends Model<Transaction> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @Column(DataType.STRING)
  data!: string;

  @Column(DataType.STRING)
  points!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.INTEGER)
  amount!: number;

  @BelongsTo(() => User)
  user!: User;
}
