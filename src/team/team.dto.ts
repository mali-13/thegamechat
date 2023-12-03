import { IsNumber, IsString } from 'class-validator'

export class TeamDto {
  @IsString()
  name: string

  @IsString()
  about: string

  @IsNumber()
  creatorId: number
}
