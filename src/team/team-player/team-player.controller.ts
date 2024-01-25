import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { TeamPlayerService } from './team-player.service'
import { UpdatePlayerDto } from '../../player/player.dto'

@Controller('teams/:teamId/players')
export class TeamPlayerController {
  constructor(readonly teamPlayerService: TeamPlayerService) {}

  @Put('/')
  async updatePlayers(
    @Param('teamId') teamId: number,
    @Body() players: UpdatePlayerDto[],
  ) {
    return this.teamPlayerService.updatePlayers(teamId, players)
  }

  @Post('/')
  async addPlayer(
    @Param('teamId') teamId: number,
    @Query('inviteCode') inviteCode: string,
    @Body() player: UpdatePlayerDto,
  ) {
    return this.teamPlayerService.addPlayer(teamId, player, inviteCode)
  }

  @Delete('/:playerId')
  async removePlayer(
    @Param('teamId') teamId: number,
    @Param('playerId') playerId: number,
  ) {
    return this.teamPlayerService.removePlayer(teamId, playerId)
  }
}
