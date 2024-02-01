import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UpdatePlayerDto } from '../../player/player.dto'
import { In, Repository } from 'typeorm'
import { Team } from '../team.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { PlayerService } from '../../player/player.service'
import { Mattermost } from '../../mattermost/mattermost.service'

@Injectable()
export class TeamPlayerService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly playerService: PlayerService,
    private readonly mattermost: Mattermost,
  ) {}

  async findPlayers(teamId: number) {
    const team = await this.teamRepository.findOne({
      where: { teamId },
      relations: {
        players: true,
        creator: true,
      },
    })

    if (!team) {
      throw new NotFoundException(
        'Team not found. The provided team was not found',
      )
    }

    return team.players
  }

  async updatePlayers(teamId: number, playersDto: UpdatePlayerDto[]) {
    const team = await this.teamRepository.findOneBy({ teamId })

    if (!team) {
      throw new NotFoundException(
        'Team not found. The provided team was not found',
      )
    }

    const playerIds = playersDto.map((player) => player.playerId)

    const players = await this.playerService.findPlayers({
      where: {
        playerId: In(playerIds),
      },
    })

    team.players = players

    await this.teamRepository.save(team)

    return players
  }

  async removePlayer(teamId: number, playerId: number) {
    const team = await this.teamRepository.findOne({
      where: { teamId },
      relations: {
        players: true,
        creator: true,
      },
    })

    if (!team) {
      throw new NotFoundException(
        'Team not found. The provided team was not found',
      )
    }

    const player = team.players.find((player) => player.playerId === playerId)

    if (!player) {
      throw new NotFoundException(
        `Cannot remove player. Player ${playerId} is not member of team ${teamId}`,
      )
    }

    await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'players')
      .of(team)
      .remove(player)

    return player
  }

  async addPlayer(
    teamId: number,
    playerDto: UpdatePlayerDto,
    inviteCode?: string,
  ) {
    const team = await this.teamRepository.findOne({
      where: { teamId },
      relations: {
        players: true,
        creator: true,
        inviteCodes: true,
      },
    })

    if (!team) {
      throw new NotFoundException(
        'Team not found. The provided team was not found',
      )
    }

    const invalidInviteCode = !team.inviteCodes.some(
      (code) => code.code === inviteCode,
    )

    if (inviteCode && invalidInviteCode) {
      throw new BadRequestException(
        `Invalid invite code. Team ${teamId} does not have ${inviteCode} as an invite code`,
      )
    }

    let player = team.players.find(
      (player) => player.playerId === playerDto.playerId,
    )

    if (player) return player

    player = await this.playerService.findOneBy(playerDto.playerId)

    if (!player) {
      throw new NotFoundException(
        `Player not found. Player with id ${playerDto.playerId} was not found`,
      )
    }

    team.players.push(player)

    await this.mattermost.addToChannel(player.mattermostUserId, team.channelId)

    await this.teamRepository.save(team)

    return player
  }
}
