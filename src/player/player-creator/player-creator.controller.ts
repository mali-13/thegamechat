import { Body, Controller, Post } from '@nestjs/common'
import { PlayerCreatorService } from './player-creator.service'
import { CreatePlayerDto } from '../player.dto'

@Controller()
export class PlayerCreatorController {
  constructor(private readonly playerCreatorService: PlayerCreatorService) {}

  @Post('/players')
  savePlayer(@Body() playerDto: CreatePlayerDto) {
    return this.playerCreatorService.savePlayer(playerDto)
  }
}
