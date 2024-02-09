import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { UpdatePlayerDto } from '../../../player/player.dto'
import { TeamPlayerEditHandler } from './team-player-edit-handler'

@Controller('teams/:teamId/players')
export class TeamPlayerEditHandlerController {
  constructor(private readonly teamPlayerEditHandler: TeamPlayerEditHandler) {}

  @Put('/')
  async updatePlayers(
    @Param('teamId') teamId: number,
    @Body() players: UpdatePlayerDto[],
  ) {
    return this.teamPlayerEditHandler.updatePlayers(teamId, players)
  }

  @Post('/')
  async addPlayer(
    @Param('teamId') teamId: number,
    @Query('inviteCode') inviteCode: string,
    @Body() player: UpdatePlayerDto,
  ) {
    return this.teamPlayerEditHandler.addPlayer(teamId, player, inviteCode)
  }

  @Delete('/:playerId')
  async removePlayer(
    @Param('teamId') teamId: number,
    @Param('playerId') playerId: number,
  ) {
    return this.teamPlayerEditHandler.removePlayer(teamId, playerId)
  }
}
