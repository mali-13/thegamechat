import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  playerId: number

  @Column()
  name: string
}
