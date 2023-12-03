import { Body, Controller, Get, Post } from '@nestjs/common'
import { PlayerService } from './player.service'
import { PlayerDto } from './player.dto'

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('/')
  savePlayer(@Body() playerDto: PlayerDto) {
    return this.playerService.savePlayer(playerDto)
  }

  @Get('/')
  getPlayers() {
    return this.playerService.findPlayers({})
  }
}
