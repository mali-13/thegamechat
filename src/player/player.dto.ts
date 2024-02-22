import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreatePlayerDto {
  @IsNumber()
  @IsOptional()
  playerId?: number

  @IsString()
  name: string

  @Max(60)
  @Min(5)
  @IsNumber()
  age?: number

  @MinLength(1)
  @MaxLength(56)
  @IsString()
  location: string

  @MinLength(6)
  password: string
}

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
