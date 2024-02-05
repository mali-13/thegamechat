import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class GameChat {
  @PrimaryGeneratedColumn()
  gameChatId: number

  @Column()
  challengerTeamId: number

  @Column()
  challengedTeamId: number

  @Column()
  channelId: string

  @CreateDateColumn()
  created: Date
}
