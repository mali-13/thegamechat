import { Body, Controller, Get, Param, Post } from '@nestjs/common'
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

  @Get('/:teamId')
  findById(@Param('teamId') teamId: number) {
    return this.teamService.findOne({
      where: { teamId },
      relations: { players: true, creator: true, inviteCodes: true },
    })
  }
}
