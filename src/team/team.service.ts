import { Injectable, NotFoundException } from '@nestjs/common'
import { TeamDto, TeamFindOptions } from './team.dto'
import { Team } from './team.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as _ from 'lodash'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async saveDto(teamDto: TeamDto) {
    const team = await this.teamRepository.findOneBy({ teamId: teamDto.teamId })

    if (!team) {
      throw new NotFoundException(
        `Team not found. There is not team with id:${teamDto.teamId}`,
      )
    }

    team.name = teamDto.name
    team.about = teamDto.about
    team.location = teamDto.location

    return this.teamRepository.save(team)
  }

  async save(team: Team) {
    return this.teamRepository.save(team)
  }

  async find(options?: TeamFindOptions) {
    const teams = await this.teamRepository.find(options)

    teams.forEach((team) => {
      team.playerCount = team.players.length
      team.playerAverageAge = _.meanBy(team.players, (player) => player.age)
      //Rule: Team is considered established if it has at least 5 players
      team.established = team.playerCount >= 5
    })

    return teams.filter(
      (team) =>
        options.established == null || team.established === options.established,
    )
  }

  async findOne(options: FindOneOptions<Team>): Promise<Team> {
    return this.teamRepository.findOne(options)
  }
}
