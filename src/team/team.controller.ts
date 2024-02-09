import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { TeamDto } from './team.dto'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Patch('/')
  patch(@Body() teamDto: TeamDto) {
    return this.teamService.saveDto(teamDto)
  }

  @Get('/')
  async find() {
    return this.teamService.find({
      relations: {
        players: true,
        creator: true,
      },
    })
  }

  @Get('/:teamId')
  async findById(@Param('teamId') teamId: number) {
    return this.teamService.findOne({
      where: { teamId },
      relations: { players: true, creator: true, inviteCodes: true },
    })
  }
}
