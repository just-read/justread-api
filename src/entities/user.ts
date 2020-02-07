import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsEmail()
  email!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 30 })
  name!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  avatar?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  shortBio?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }
}

export default User;
