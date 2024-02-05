import { INestApplication } from '@nestjs/common'
import { TeamCreatorService } from '../../src/team/team-creator/team-creator.service'
import { TeamDto } from '../../src/team/team.dto'

const defaultTeam: TeamDto = {
  about: 'The killer team from Kosovo',
  creatorId: 1,
  name: 'The killers',
}

export function createTeam(team: Partial<TeamDto>, app: INestApplication) {
  const teamCreatorService = app.get<TeamCreatorService>(TeamCreatorService)

  return teamCreatorService.create({
    ...defaultTeam,
    ...team,
  })
}
