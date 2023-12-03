import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PlayerDto {
  @IsNumber()
  @IsOptional()
  playerId: number

  @IsString()
  name: string
}
