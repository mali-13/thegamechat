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
}
