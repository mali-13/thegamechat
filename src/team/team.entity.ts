import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Player } from '../player/player.entity'
import { InviteCode } from './team-invite-code/invite-code.entity'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  teamId: number

  @Column()
  name: string
  @Column()
  about: string
  @Column()
  location: string
  @Column()
  channelId: string

  established: boolean

  @ManyToOne(() => Player, (player) => player.createdTeams)
  creator: Player

  playerCount: number

  @ManyToMany(() => Player, (player) => player.teams)
  @JoinTable()
  players: Player[]

  @OneToMany(() => InviteCode, (inviteCode) => inviteCode.team, {
    cascade: true,
  })
  inviteCodes: InviteCode[]
}
