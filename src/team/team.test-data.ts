import { Injectable } from '@nestjs/common'
import { TeamCreatorService } from './team-creator/team-creator.service'
import { TeamDto } from './team.dto'

@Injectable()
export class TeamTestData {
  defaultTeam: TeamDto = {
    about: 'The killer team from Kosovo',
    location: 'Shkoder',
    creatorId: 1,
    name: 'The killers',
  }

  constructor(private readonly teamCreatorService: TeamCreatorService) {}

  createTeam(team: Partial<TeamDto>) {
    return this.teamCreatorService.create({
      ...this.defaultTeam,
      ...team,
    })
  }
}
