/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import Book from './book';

export enum AuthorJob {
  WRITER = 'writer',
  TRANSLATOR = 'translator',
}

@Entity()
class Author extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'enum', enum: AuthorJob, default: AuthorJob.WRITER })
  job!: AuthorJob;

  @ManyToMany(
    type => Book,
    book => book.authors,
  )
  books!: Book[];
}

export default Author;
