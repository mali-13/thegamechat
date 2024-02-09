import { TeamDto } from '../team.dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Team } from '../team.entity'
import { uuid } from 'short-uuid'
import { PlayerService } from '../../player/player.service'
import { Mattermost } from '../../mattermost/mattermost.service'
import { TeamPlayerEditHandler } from '../team-player/team-player-edit-handler/team-player-edit-handler'
import { TeamService } from '../team.service'

@Injectable()
export class TeamCreatorService {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamPlayerEditHandler: TeamPlayerEditHandler,
    private readonly playerService: PlayerService,
    private readonly mattermost: Mattermost,
  ) {}

  async create(teamDto: TeamDto) {
    const creator = await this.playerService.findOneBy(teamDto.creatorId)

    if (!creator) {
      throw new NotFoundException(
        'Creator not found. The provided creator id was not found',
      )
    }

    const team = new Team()
    team.name = teamDto.name
    team.about = teamDto.about
    team.creator = creator

    const mattermostTeamName =
      teamDto.name.replaceAll(' ', '-').toLowerCase() + '-' + uuid()

    const teamChannel = await this.mattermost.createChannel(
      // @ts-expect-error send only required values
      {
        team_id: this.mattermost.config.teamId,
        name: mattermostTeamName,
        display_name: teamDto.name,
        type: 'P',
      },
    )

    team.channelId = teamChannel.id

    const newTeam = await this.teamService.save(team)

    await this.teamPlayerEditHandler.addPlayer(newTeam.teamId, {
      playerId: creator.playerId,
    })

    return newTeam
  }
}
