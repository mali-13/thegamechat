import { TeamChallengeService } from './team-challenge.service'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ChallengeDto, UpdateChallengeDto } from '../../challenge/challenge.dto'
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

  @Patch('/:challengeId')
  save(
    @Param('challengeId') challengeId: number,
    @Param('teamId') teamId: number,
    @Body() challengeDto: UpdateChallengeDto,
  ) {
    return this.teamChallengeService.save(challengeDto)
  }
}
