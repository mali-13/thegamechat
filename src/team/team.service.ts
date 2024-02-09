import { Injectable, NotFoundException } from '@nestjs/common'
import { TeamDto } from './team.dto'
import { Team } from './team.entity'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
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

  find(options: FindManyOptions<Team>) {
    return this.teamRepository.find(options)
  }

  async findOne(options: FindOneOptions<Team>): Promise<Team> {
    return this.teamRepository.findOne(options)
  }
}
