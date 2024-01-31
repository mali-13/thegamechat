import { Injectable, NotFoundException } from '@nestjs/common'
import { TeamDto } from './team.dto'
import { Team } from './team.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PlayerService } from '../player/player.service'
import { Mattermost } from '../mattermost/mattermost.module'
import { uuid } from 'short-uuid'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly playerService: PlayerService,
    private readonly mattermost: Mattermost,
  ) {}

  async save(teamDto: TeamDto) {
    const team = await this.teamRepository.findOneBy({ teamId: teamDto.teamId })

    if (!team) {
      throw new NotFoundException(
        `Team not found. There is not team with id:${teamDto.teamId}`,
      )
    }

    team.name = teamDto.name
    team.about = teamDto.about

    return this.teamRepository.save(team)
  }

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

    await this.mattermost.addToChannel(creator.mattermostUserId, teamChannel.id)

    return this.teamRepository.create(team)
  }

  find() {
    return this.teamRepository.find({
      relations: {
        players: true,
        creator: true,
      },
    })
  }

  async findOne(options: FindOneOptions<Team>): Promise<Team> {
    return this.teamRepository.findOne(options)
  }
}
