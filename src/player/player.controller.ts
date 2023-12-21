import { Body, Controller, Get, Post } from '@nestjs/common'
import { PlayerService } from './player.service'
import { CreatePlayerDto } from './player.dto'

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('/')
  savePlayer(@Body() playerDto: CreatePlayerDto) {
    return this.playerService.savePlayer(playerDto)
  }

  @Get('/')
  getPlayers() {
    return this.playerService.findPlayers({})
  }
}
