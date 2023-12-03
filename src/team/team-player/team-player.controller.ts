import { Body, Controller, Param, Put } from '@nestjs/common'
import { TeamPlayerService } from './team-player.service'
import { PlayerDto } from '../../player/player.dto'

@Controller('teams/:teamId/players')
export class TeamPlayerController {
  constructor(readonly teamPlayerService: TeamPlayerService) {}

  @Put('/')
  async updatePlayers(
    @Param('teamId') teamId: number,
    @Body() players: PlayerDto[],
  ) {
    return this.teamPlayerService.updatePlayers(teamId, players)
  }
}