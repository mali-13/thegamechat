import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreatePlayerDto {
  @IsNumber()
  @IsOptional()
  playerId?: number

  @IsString()
  name: string

  @MinLength(6)
  password: string
}

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
