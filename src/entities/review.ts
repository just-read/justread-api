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
import Rating from './rating';

@Entity()
class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ type: 'bigint', unsigned: true })
  userId!: number;

  @Column({ type: 'bigint', unsigned: true })
  bookId!: number;

  @Column({ type: 'bigint', unsigned: true })
  ratingId!: number;

  @Column({ type: 'text', nullable: false })
  content!: string;

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
    type => Rating,
    rating => rating.review,
  )
  rating!: Rating;
}

export default Review;
