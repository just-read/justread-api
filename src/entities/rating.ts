/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Book from './book';
import User from './user';
import Review from './review';

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
    user => user.ratings,
  )
  user!: User;

  @ManyToOne(
    type => Book,
    book => book.ratings,
  )
  book!: Book;

  @OneToOne(
    type => Review,
    review => review.rating,
  )
  review?: Review;
}

export default Rating;
