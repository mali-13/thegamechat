import { Injectable } from '@nestjs/common'
import { ChallengeService } from '../../challenge/challenge.service'
import { ChallengeDto, UpdateChallengeDto } from '../../challenge/challenge.dto'
import { ChallengeFindOptionDto } from './team-challenge.dto'
import { ChallengeStatus } from '../../challenge/challenge.entity'

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

  async save(challengeDto: UpdateChallengeDto) {
    const challenge = await this.challengeService.findOne({
      where: { challengeId: challengeDto.challengeId },
    })

    const challengeAccepted =
      challenge.status === ChallengeStatus.PENDING &&
      challengeDto.status === ChallengeStatus.ACCEPTED

    const challengeRejected =
      (challenge.status = ChallengeStatus.PENDING) &&
      challengeDto.status === ChallengeStatus.REJECTED

    if (!!challengeDto.status) {
      challenge.status = challengeDto.status
    }

    if (!!challengeDto.message) {
      challenge.message = challengeDto.message
    }

    return this.challengeService.save(challenge)
  }
}
