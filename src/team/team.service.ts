import { Injectable } from '@nestjs/common'
import { TeamDto } from './team.dto'
import { Team } from './team.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  save(teamDto: TeamDto) {
    const team = new Team()
    team.name = teamDto.name
    team.about = teamDto.about
    return this.teamRepository.save(team)
  }

  find() {
    return this.teamRepository.find()
  }
}
