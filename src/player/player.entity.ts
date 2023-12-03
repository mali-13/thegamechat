import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Team } from '../team/team.entity'

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  playerId: number

  @Column()
  name: string

  @OneToMany(() => Team, (team) => team.creator)
  createdTeams: Team[]
}
