import { Body, Controller, Get, Post } from '@nestjs/common'
import { TeamDto } from './team.dto'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/')
  save(@Body() teamDto: TeamDto) {
    return this.teamService.save(teamDto)
  }

  @Get('/')
  find() {
    return this.teamService.find()
  }
}
