import { Controller, Get } from '@nestjs/common'
import { PlayerService } from './player.service'

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/')
  getPlayers() {
    return this.playerService.findPlayers({})
  }
}
