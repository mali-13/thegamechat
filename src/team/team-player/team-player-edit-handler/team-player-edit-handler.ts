import { Injectable } from '@nestjs/common'
import { TeamPlayerService } from '../team-player.service'
import { TeamChannelSync } from '../../../team-channel-sync/team-channel-sync'
import { UpdatePlayerDto } from '../../../player/player.dto'

@Injectable()
export class TeamPlayerEditHandler {
  constructor(
    private readonly teamPlayerService: TeamPlayerService,
    private readonly teamChannelSync: TeamChannelSync,
  ) {}

  async addPlayer(
    teamId: number,
    player: UpdatePlayerDto,
    inviteCode?: string,
  ) {
    const addedPlayer = await this.teamPlayerService.addPlayer(
      teamId,
      player,
      inviteCode,
    )

    await this.teamChannelSync.sync(teamId)

    return addedPlayer
  }

  async removePlayer(teamId: number, playerId: number) {
    const removedPlayer = await this.teamPlayerService.removePlayer(
      teamId,
      playerId,
    )

    await this.teamChannelSync.sync(teamId)

    return removedPlayer
  }

  async updatePlayers(teamId: number, players: UpdatePlayerDto[]) {
    await this.teamPlayerService.updatePlayers(teamId, players)

    await this.teamChannelSync.sync(teamId)

    return Promise.resolve(undefined)
  }
}
