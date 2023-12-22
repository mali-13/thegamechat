import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Team } from '../team.entity'

@Entity()
export class InviteCode {
  @PrimaryGeneratedColumn()
  inviteCodeId: number

  @Column()
  code: string

  @Column()
  created: Date

  @ManyToOne(() => Team, (team) => team.inviteCodes)
  team: Team
}
