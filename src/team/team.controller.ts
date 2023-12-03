import { Controller } from '@nestjs/common'
import { TeamDto } from './team.dto'

@Controller('teams')
export class TeamController {
  save(teamDto: TeamDto) {}
}
