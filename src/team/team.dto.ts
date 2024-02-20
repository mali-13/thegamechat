import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { Team } from './team.entity'
import { CustomFindManyOptions } from '../coomon/custom-find-many-options'

export class TeamDto {
  @IsNumber()
  @IsOptional()
  teamId?: number

  @IsString()
  name: string

  @IsString()
  about: string

  @IsNumber()
  creatorId: number
}

export class TeamFindOptions extends CustomFindManyOptions<Team> {
  @IsBoolean()
  @IsOptional()
  established?: boolean
}
