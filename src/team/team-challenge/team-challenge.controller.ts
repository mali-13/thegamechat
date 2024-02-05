import { TeamChallengeService } from './team-challenge.service'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ChallengeDto } from '../../challenge/challenge.dto'
import { ChallengeFindOptionDto } from './team-challenge.dto'

@Controller('teams/:teamId/challenges')
export class TeamChallengeController {
  constructor(private readonly teamChallengeService: TeamChallengeService) {}

  @Post('/')
  create(@Param('teamId') teamId: number, @Body() challengeDto: ChallengeDto) {
    if (teamId != challengeDto.challengerTeamId) {
      throw new ForbiddenException(
        `Wrong team! You can only create a challenge for team ${teamId}`,
      )
    }

    return this.teamChallengeService.create(challengeDto)
  }

  @Get('/')
  find(
    @Param('teamId') teamId: number,
    @Query() findOptions: ChallengeFindOptionDto,
  ) {
    return this.teamChallengeService.find(teamId, findOptions)
  }
}
