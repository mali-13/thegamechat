import { ChallengeStatus } from './challenge.entity'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class ChallengeDto {
  @IsNumber()
  @IsOptional()
  challengeId?: number

  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus

  @IsNumber()
  challengerTeamId: number

  @IsNumber()
  challengedTeamId: number

  @IsString()
  @IsOptional()
  message?: string

  @IsNumber()
  @IsOptional()
  madeOn?: Date
}
