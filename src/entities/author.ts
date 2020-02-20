import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}

export default Author;
