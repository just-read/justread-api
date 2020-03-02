import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import Book from './book';
import User from './user';
import Rating from './rating';

@Entity()
class Review extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'int', unsigned: true })
  userId!: number;

  @Column({ type: 'int', unsigned: true })
  bookId!: number;

  @Column({ type: 'text', nullable: false })
  content!: string;

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

  @OneToOne(
    type => Rating,
    rating => rating.review
  )
  rating!: Rating;
}

export default Review;
