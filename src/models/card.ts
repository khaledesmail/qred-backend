import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'cards', timestamps: false })
export class Card extends Model<Card> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @Column(DataType.STRING)
  image!: string;

  @Column(DataType.BOOLEAN)
  activated!: boolean;

  @Column(DataType.INTEGER)
  spend_limit!: number;

  @BelongsTo(() => User)
  user!: User;
}
