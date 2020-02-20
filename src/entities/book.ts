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
  ManyToMany
} from 'typeorm';
import shortid from 'shortid';
import Rating from './rating';
import Review from './review';
import Author from './author';

@Entity()
class Book extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Index('idx_unique_key', { unique: true })
  @Column({ type: 'varchar', length: 32 })
  uniqueId!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  year?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToMany(
    type => Author,
    author => author.books
  )
  authors!: Author[];

  @OneToMany(
    type => Rating,
    rating => rating.book
  )
  ratings!: Rating[];

  @OneToMany(
    type => Review,
    review => review.book
  )
  reviews!: Review[];

  @BeforeInsert()
  async generateUniqueId(): Promise<void> {
    this.uniqueId = shortid.generate();
  }
}

export default Book;
