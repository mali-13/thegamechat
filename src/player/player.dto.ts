import { IsNumber, IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreatePlayerDto {
  @IsNumber()
  @IsOptional()
  playerId?: number

  @IsString()
  name: string
}

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
