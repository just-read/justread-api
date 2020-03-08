/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import shortid from 'shortid';
import Rating from './rating';
import Review from './review';

@Entity()
class Book extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Index('idx_unique_id', { unique: true })
  @Column({ type: 'varchar', length: 20, unique: true })
  uniqueId!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Index('idx_isbn', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  isbn!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  year?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  authors!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(
    type => Rating,
    rating => rating.book,
  )
  ratings!: Rating[];

  @OneToMany(
    type => Review,
    review => review.book,
  )
  reviews!: Review[];

  @BeforeInsert()
  async generateUniqueId(): Promise<void> {
    this.uniqueId = shortid.generate();
  }
}

export default Book;
