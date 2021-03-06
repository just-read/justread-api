/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { generateToken } from '../utils/auth';
import Rating from './rating';
import Review from './review';
import Bookshelf from './bookshelf';

const BCRYPT_ROUNDS = 10;

interface GenerateTokensResult {
  accessToken: string;
  refreshToken: string;
}

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsEmail()
  email!: string;

  // 소셜 로그인시 비밀번호가 따로 필요하지 않음
  @Column({ type: 'varchar', length: 100, nullable: true })
  password!: string;

  @Column({ type: 'varchar', length: 30 })
  nickName!: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  shortBio!: string | null;

  @Index('idx_google_id', { unique: true })
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  googleId!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany((type) => Rating, (rating) => rating.user)
  ratings!: Rating[];

  @OneToMany((type) => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany((type) => Bookshelf, (bookshelf) => bookshelf.user)
  bookshelves!: Bookshelf[];

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

  async generateUserTokens(): Promise<GenerateTokensResult> {
    const accessToken = await generateToken(this, { subject: 'accessToken', expiresIn: '1h' });
    const refreshToken = await generateToken(this, { subject: 'refreshToken', expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  async refreshUserTokens(
    originalRefreshToken: string,
    refreshTokenExp: number,
  ): Promise<GenerateTokensResult> {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    let refreshToken = originalRefreshToken;

    if (diff < 1000 * 60 * 60 * 24 * 3) {
      refreshToken = await generateToken(this, {
        subject: 'refreshToken',
        expiresIn: '30d',
      });
    }
    const accessToken = await generateToken(this, {
      subject: 'accessToken',
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }
}

export default User;
