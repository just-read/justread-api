import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import shortid from 'shortid';

@Entity()
class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
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

  @BeforeInsert()
  async generateUniqueId(): Promise<void> {
    this.uniqueId = shortid.generate();
  }
}

export default Book;
