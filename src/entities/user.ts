import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn
} from 'typeorm';
import bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { generateToken } from '../utils/auth';

const BCRYPT_ROUNDS = 10;

interface GenerateTokensResult {
  accessToken: string;
  refreshToken: string;
}

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
  nickName!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  avatar?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  shortBio?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

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
    refreshTokenExp: number
  ): Promise<GenerateTokensResult> {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    let refreshToken = originalRefreshToken;

    if (diff < 1000 * 60 * 60 * 24 * 3) {
      refreshToken = await generateToken(this, {
        subject: 'refresh_token',
        expiresIn: '30d'
      });
    }
    const accessToken = await generateToken(this, {
      subject: 'access_token',
      expiresIn: '1h'
    });

    return { refreshToken, accessToken };
  }
}

export default User;
