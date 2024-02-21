import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
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

  @MinLength(1)
  @MaxLength(56)
  @IsString()
  location: string

  @IsNumber()
  creatorId: number
}

export class TeamFindOptions extends CustomFindManyOptions<Team> {
  @IsBoolean()
  @IsOptional()
  established?: boolean
}
