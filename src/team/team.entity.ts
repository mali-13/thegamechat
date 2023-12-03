import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Player } from '../player/player.entity'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  teamId: number

  @Column()
  name: string
  @Column()
  about: string

  players: Player[]
}
