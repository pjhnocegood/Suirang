// src/community/community.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletAddress: string;

  @Column()
  transactionCount: number;

  @Column()
  content: string;

  @Column()
  gameId: number;
}
