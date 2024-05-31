import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array')
  packageId: string[];

  @Column({ nullable: true })
  coinType: string;

  @Column({ nullable: true })
  eventType: string;

  @Column({ nullable: true }) // 이 부분은 선택 사항에 따라 nullable 속성을 추가합니다.
  websiteUrl: string;

  @Column({ nullable: true })
  discordUrl: string;

  @Column({ nullable: true })
  twitterUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  ranking: number;

  @Column({ nullable: true })
  transactionCount: number;
}
