import { IsNumber, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreatePlayerDto {
  @IsNumber()
  playerId: number

  @IsString()
  name: string
}

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
