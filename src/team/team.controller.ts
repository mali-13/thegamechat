import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { TeamDto, TeamFindOptions } from './team.dto'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Patch('/')
  patch(@Body() teamDto: TeamDto) {
    return this.teamService.saveDto(teamDto)
  }

  @Get('/')
  async find(@Query() findOptions: TeamFindOptions) {
    findOptions = {
      ...findOptions,
      relations: {
        players: true,
        creator: true,
      },
    }

    return this.teamService.find(findOptions)
  }

  @Get('/:teamId')
  async findById(@Param('teamId') teamId: number) {
    return this.teamService.findOne({
      where: { teamId },
      relations: { players: true, creator: true, inviteCodes: true },
    })
  }
}
