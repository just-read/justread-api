import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import Book from './book';

export enum AuthorType {
  WRITER = 'writer',
  TRANSLATOR = 'translator'
}

@Entity()
class Author extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'enum', enum: AuthorType, default: AuthorType.WRITER })
  type!: AuthorType;

  @Column({ type: 'varchar', length: 30 })
  name!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToMany(
    type => Book,
    book => book.authors
  )
  books!: Book[];
}

export default Author;
