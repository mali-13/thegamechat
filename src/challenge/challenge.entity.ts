import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum ChallengeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  challengeId: number

  @Column({ type: 'enum', enum: ChallengeStatus })
  status: ChallengeStatus

  @Column()
  challengerTeamId: number

  @Column()
  challengedTeamId: number

  @Column({ nullable: true })
  message?: string

  @CreateDateColumn()
  madeOn: Date
}
