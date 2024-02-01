import { Body, Controller, Post } from '@nestjs/common'
import { TeamCreatorService } from './team-creator.service'
import { TeamDto } from '../team.dto'

@Controller()
export class TeamCreatorController {
  constructor(private readonly teamCreatorService: TeamCreatorService) {}

  @Post('/teams')
  create(@Body() teamDto: TeamDto) {
    return this.teamCreatorService.create(teamDto)
  }
}
