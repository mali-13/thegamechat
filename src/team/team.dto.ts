import { IsNumber, IsOptional, IsString } from 'class-validator'

export class TeamDto {
  @IsNumber()
  @IsOptional()
  teamId: number

  @IsString()
  name: string

  @IsString()
  about: string

  @IsNumber()
  creatorId: number
}
