/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import Author from './author';
import Rating from './rating';
import Review from './review';

@Entity()
class Book extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Index('idx_isbn', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  isbn!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  year?: number;

  @ManyToMany((type) => Author, (author) => author.books, { cascade: true })
  authors!: Author[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany((type) => Rating, (rating) => rating.book)
  ratings!: Rating[];

  @OneToMany((type) => Review, (review) => review.book)
  reviews!: Review[];
}

export default Book;
