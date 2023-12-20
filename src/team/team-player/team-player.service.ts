import { Injectable, NotFoundException } from '@nestjs/common'
import { PlayerDto } from '../../player/player.dto'
import { In, Repository } from 'typeorm'
import { Team } from '../team.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { PlayerService } from '../../player/player.service'

@Injectable()
export class TeamPlayerService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly playerService: PlayerService,
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

  async updatePlayers(teamId: number, playersDto: PlayerDto[]) {
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
}
