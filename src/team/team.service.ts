import { Injectable, NotFoundException } from '@nestjs/common'
import { TeamDto } from './team.dto'
import { Team } from './team.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PlayerService } from '../player/player.service'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly playerService: PlayerService,
  ) {}

  async save(teamDto: TeamDto) {
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
    return this.teamRepository.save(team)
  }

  find() {
    return this.teamRepository.find()
  }
}
