import { ChallengeStatus } from '../../challenge/challenge.entity'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'

export class ChallengeFindOptionDto {
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus

  @IsBoolean()
  @IsOptional()
  challenger?: boolean

  @IsOptional()
  @IsOptional()
  challenged?: boolean
}
