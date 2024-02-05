import { Injectable } from '@nestjs/common'
import { ChallengeService } from '../../challenge/challenge.service'
import { ChallengeDto } from '../../challenge/challenge.dto'
import { ChallengeFindOptionDto } from './team-challenge.dto'

@Injectable()
export class TeamChallengeService {
  constructor(private readonly challengeService: ChallengeService) {}

  create(challengeDto: ChallengeDto) {
    return this.challengeService.create(challengeDto)
  }

  async find(teamId: number, findOptions: ChallengeFindOptionDto) {
    let challenges = await this.challengeService.find({
      where: [{ challengerTeamId: teamId }, { challengedTeamId: teamId }],
    })

    if (!!findOptions.challenger) {
      challenges = challenges.filter(
        (challenge) => challenge.challengerTeamId === teamId,
      )
    }

    if (!!findOptions.challenged) {
      challenges = challenges.filter(
        (challenge) => challenge.challengedTeamId === teamId,
      )
    }

    if (!!findOptions.status) {
      challenges = challenges.filter(
        (challenge) => challenge.status === findOptions.status,
      )
    }

    return challenges
  }
}
