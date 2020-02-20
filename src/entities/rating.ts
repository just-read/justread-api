import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import User from './user';
import Book from './book';

@Entity()
class Rating extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'bigint', unsigned: true })
  userId!: number;

  @Column({ type: 'bigint', unsigned: true })
  bookId!: number;

  @Column({ type: 'smallint' })
  rating!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(
    type => User,
    user => user.ratings
  )
  user!: User;

  @ManyToOne(
    type => Book,
    book => book.ratings
  )
  book!: Book;
}

export default Rating;
