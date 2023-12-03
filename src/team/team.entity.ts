import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Player } from '../player/player.entity'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  teamId: number

  @Column()
  name: string
  @Column()
  about: string

  @ManyToOne(() => Player, (player) => player.createdTeams)
  creator: Player

  @ManyToMany(() => Player, (player) => player.teams)
  @JoinTable()
  players: Player[]
}
