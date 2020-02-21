import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne
} from 'typeorm';
import Book from './book';
import Bookshelf from './bookshelf';

@Entity()
class BookshelfList extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'bigint', unsigned: true })
  bookshelfId!: number;

  @Column({ type: 'bigint', unsigned: true })
  bookId!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(type => Bookshelf)
  bookshelf!: Bookshelf;

  @OneToOne(type => Book)
  book!: Book;
}

export default BookshelfList;
